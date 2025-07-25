// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./OracleRouter.sol";
import "../interfaces/IUserPositionRegistry.sol";
import "../interfaces/ILendingMarket.sol";
import "../lending/CollateralManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RiskEngine is Ownable, ReentrancyGuard {
    OracleRouter public immutable oracle;
    IUserPositionRegistry public positionRegistry;
    ILendingMarket public lendingMarket;
    CollateralManager public collateralManager;
    
    // Risk parameters
    uint256 public constant LIQUIDATION_THRESHOLD = 8000; // 80%
    uint256 public constant HEALTH_FACTOR_PRECISION = 1e18;
    uint256 public constant MIN_HEALTH_FACTOR = 1e18; // 1.0
    uint256 public constant CRITICAL_HEALTH_FACTOR = 11e17; // 1.1
    uint256 public constant WARNING_HEALTH_FACTOR = 12e17; // 1.2
    
    // Asset risk parameters
    mapping(address => uint256) public collateralFactors; // LTV ratios
    mapping(address => uint256) public liquidationBonuses;
    mapping(address => bool) public isCollateralEnabled;
    
    // User risk monitoring
    mapping(address => uint256) public lastHealthFactorUpdate;
    mapping(address => bool) public isUnderMonitoring;
    
    // Risk thresholds for different assets
    struct AssetRiskParams {
        uint256 collateralFactor; // Max LTV
        uint256 liquidationThreshold; // Liquidation LTV
        uint256 liquidationBonus; // Liquidator incentive
        uint256 reserveFactor; // Protocol reserve
        bool isActive;
    }
    
    struct RiskProfile {
        uint256 totalCollateralValue;
        uint256 totalBorrowValue;
        uint256 adjustedCollateralValue;
        uint256 healthFactor;
        uint256 liquidationThreshold;
        bool liquidatable;
        bool underMonitoring;
        uint256 maxBorrowCapacity;
    }
    
    struct LiquidationData {
        address user;
        address collateralAsset;
        address debtAsset;
        uint256 collateralAmount;
        uint256 debtAmount;
        uint256 liquidationBonus;
        uint256 healthFactor;
    }
    
    mapping(address => AssetRiskParams) public assetRiskParams;
    
    event HealthFactorUpdated(address indexed user, uint256 healthFactor);
    event LiquidationRisk(address indexed user, uint256 healthFactor);
    event RiskParametersUpdated(address indexed asset, uint256 collateralFactor, uint256 liquidationThreshold);
    event UserMonitoringStatusChanged(address indexed user, bool isMonitoring);
    event LiquidationTriggered(address indexed user, address indexed liquidator, uint256 healthFactor);
    
    constructor(address _oracle, address _positionRegistry, address _lendingMarket, address _collateralManager, address initialOwner) Ownable(initialOwner) {
        oracle = OracleRouter(_oracle);
        positionRegistry = IUserPositionRegistry(_positionRegistry);
        lendingMarket = ILendingMarket(_lendingMarket);
        collateralManager = CollateralManager(_collateralManager);
    }
    
    function getHealthFactor(address user) external view returns (uint256) {
        return _calculateHealthFactor(user);
    }
    
    function getRiskProfile(address user) external view returns (RiskProfile memory) {
        uint256 totalCollateralValue = _getCollateralValue(user);
        uint256 totalBorrowValue = _getBorrowValue(user);
        uint256 adjustedCollateralValue = _getAdjustedCollateralValue(user);
        uint256 healthFactor = _calculateHealthFactor(user);
        
        return RiskProfile({
            totalCollateralValue: totalCollateralValue,
            totalBorrowValue: totalBorrowValue,
            adjustedCollateralValue: adjustedCollateralValue,
            healthFactor: healthFactor,
            liquidationThreshold: LIQUIDATION_THRESHOLD,
            liquidatable: healthFactor < MIN_HEALTH_FACTOR,
            underMonitoring: isUnderMonitoring[user],
            maxBorrowCapacity: _calculateMaxBorrowCapacity(user)
        });
    }
    
    function updateHealthFactor(address user) external nonReentrant {
        uint256 healthFactor = _calculateHealthFactor(user);
        lastHealthFactorUpdate[user] = block.timestamp;
        
        // Update monitoring status
        if (healthFactor < WARNING_HEALTH_FACTOR && !isUnderMonitoring[user]) {
            isUnderMonitoring[user] = true;
            emit UserMonitoringStatusChanged(user, true);
        } else if (healthFactor > WARNING_HEALTH_FACTOR && isUnderMonitoring[user]) {
            isUnderMonitoring[user] = false;
            emit UserMonitoringStatusChanged(user, false);
        }
        
        emit HealthFactorUpdated(user, healthFactor);
        
        if (healthFactor < MIN_HEALTH_FACTOR) {
            emit LiquidationRisk(user, healthFactor);
        }
    }
    
    function setAssetRiskParams(
        address asset,
        uint256 collateralFactor,
        uint256 liquidationThreshold,
        uint256 liquidationBonus,
        uint256 reserveFactor
    ) external onlyOwner {
        require(collateralFactor <= liquidationThreshold, "Invalid collateral factor");
        require(liquidationThreshold <= 9500, "Liquidation threshold too high");
        require(liquidationBonus <= 2000, "Liquidation bonus too high");
        
        assetRiskParams[asset] = AssetRiskParams({
            collateralFactor: collateralFactor,
            liquidationThreshold: liquidationThreshold,
            liquidationBonus: liquidationBonus,
            reserveFactor: reserveFactor,
            isActive: true
        });
        
        emit RiskParametersUpdated(asset, collateralFactor, liquidationThreshold);
    }
    
    function simulateRisk(
        address user, 
        int256 priceShift
    ) external view returns (uint256 newHF, bool liquidatable) {
        // Get current positions from UserPositionRegistry
        uint256 collateralValue = _getCollateralValue(user);
        uint256 borrowValue = _getBorrowValue(user);
        
        // Apply price shift simulation
        if (priceShift < 0) {
            uint256 decrease = (collateralValue * uint256(-priceShift)) / 10000;
            collateralValue = collateralValue > decrease ? collateralValue - decrease : 0;
        } else {
            collateralValue += (collateralValue * uint256(priceShift)) / 10000;
        }
        
        // Calculate new health factor
        if (borrowValue == 0) {
            newHF = type(uint256).max;
            liquidatable = false;
        } else {
            newHF = (collateralValue * LIQUIDATION_THRESHOLD * HEALTH_FACTOR_PRECISION) / 
                    (borrowValue * 10000);
            liquidatable = newHF < MIN_HEALTH_FACTOR;
        }
        
        return (newHF, liquidatable);
    }
    
    function _calculateHealthFactor(address user) internal view returns (uint256) {
        uint256 adjustedCollateralValue = _getAdjustedCollateralValue(user);
        uint256 borrowValue = _getBorrowValue(user);
        
        if (borrowValue == 0) {
            return type(uint256).max;
        }
        
        return (adjustedCollateralValue * HEALTH_FACTOR_PRECISION) / borrowValue;
    }
    
    function _getCollateralValue(address user) internal view returns (uint256) {
        // Get user collateral tokens from CollateralManager
        address[] memory assets = collateralManager.getUserCollateralTokens(user);
        uint256 totalValue = 0;
        
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 balance = collateralManager.getUserAvailableCollateral(user, assets[i]);
            if (balance > 0) {
                uint256 price = oracle.getPrice(assets[i]);
                totalValue += (balance * price) / 1e18;
            }
        }
        
        return totalValue;
    }
    
    function _getAdjustedCollateralValue(address user) internal view returns (uint256) {
        address[] memory assets = collateralManager.getUserCollateralTokens(user);
        uint256 totalAdjustedValue = 0;
        
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 balance = collateralManager.getUserAvailableCollateral(user, assets[i]);
            if (balance > 0 && assetRiskParams[assets[i]].isActive) {
                uint256 price = oracle.getPrice(assets[i]);
                uint256 value = (balance * price) / 1e18;
                uint256 adjustedValue = (value * assetRiskParams[assets[i]].liquidationThreshold) / 10000;
                totalAdjustedValue += adjustedValue;
            }
        }
        
        return totalAdjustedValue;
    }
    
    function _getBorrowValue(address user) internal pure returns (uint256) {
        // For now, return 0 as we need to implement proper borrow tracking
        // TODO: Implement proper borrow value calculation
        return 0;
    }
    
    function _calculateMaxBorrowCapacity(address user) internal view returns (uint256) {
        address[] memory assets = collateralManager.getUserCollateralTokens(user);
        uint256 totalBorrowCapacity = 0;
        
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 balance = collateralManager.getUserAvailableCollateral(user, assets[i]);
            if (balance > 0 && assetRiskParams[assets[i]].isActive) {
                uint256 price = oracle.getPrice(assets[i]);
                uint256 value = (balance * price) / 1e18;
                uint256 borrowCapacity = (value * assetRiskParams[assets[i]].collateralFactor) / 10000;
                totalBorrowCapacity += borrowCapacity;
            }
        }
        
        return totalBorrowCapacity;
    }
    
    function isLiquidatable(address user) public view returns (bool) {
        return _calculateHealthFactor(user) < MIN_HEALTH_FACTOR;
    }
    
    function getLiquidationData(address user) external view returns (LiquidationData memory) {
        require(isLiquidatable(user), "User not liquidatable");
        
        // Find the largest collateral and debt positions
        address[] memory collateralAssets = collateralManager.getUserCollateralTokens(user);
        // TODO: Implement getUserBorrowAssets in ILendingMarket or use alternative approach
        address[] memory debtAssets; // = lendingMarket.getUserBorrowAssets(user);
        
        address maxCollateralAsset;
        uint256 maxCollateralValue = 0;
        
        for (uint256 i = 0; i < collateralAssets.length; i++) {
            uint256 balance = collateralManager.getUserAvailableCollateral(user, collateralAssets[i]);
            uint256 price = oracle.getPrice(collateralAssets[i]);
            uint256 value = (balance * price) / 1e18;
            
            if (value > maxCollateralValue) {
                maxCollateralValue = value;
                maxCollateralAsset = collateralAssets[i];
            }
        }
        
        address maxDebtAsset;
        uint256 maxDebtValue = 0;
        
        // TODO: Implement proper debt asset iteration when getUserBorrowAssets is available
        // For now, we'll use a placeholder approach
        /*
        for (uint256 i = 0; i < debtAssets.length; i++) {
            ILendingMarket.BorrowPosition memory borrowPos = lendingMarket.getBorrowPosition(user, debtAssets[i]);
            uint256 price = oracle.getPrice(debtAssets[i]);
            uint256 value = (borrowPos.amount * price) / 1e18;
            
            if (value > maxDebtValue) {
                maxDebtValue = value;
                maxDebtAsset = debtAssets[i];
            }
        }
        */
        
        return LiquidationData({
            user: user,
            collateralAsset: maxCollateralAsset,
            debtAsset: maxDebtAsset,
            collateralAmount: collateralManager.getUserAvailableCollateral(user, maxCollateralAsset),
            debtAmount: maxDebtAsset != address(0) ? lendingMarket.getBorrowPosition(user, maxDebtAsset).borrowed : 0,
            liquidationBonus: assetRiskParams[maxCollateralAsset].liquidationBonus,
            healthFactor: _calculateHealthFactor(user)
        });
    }
}
