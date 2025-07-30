// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
interface ITreasury { function depositFees(uint256 liquidityFeeAmount) external; }

contract F is ERC20, Ownable {
    struct FeeConfig { uint256 burnFee; uint256 stakingFee; uint256 liquidityFee; }
    struct WalletLocks { uint256 lockUntil; uint256 lockedAmount; }
    address public immutable STAKING_CONTRACT;
    address public immutable TREASURY_CONTRACT;
    uint256 public immutable LAUNCH_TIMESTAMP;
    address public pancakeSwapPair;
    address private immutable BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    uint256 public constant MAX_SUPPLY = 500000000 * 10**18;
    uint256 public immutable BURN_STOP_THRESHOLD = 100000000 * 10**18;
    FeeConfig public feeConfigPhase1;
    FeeConfig public feeConfigPhase2;
    uint256 public maxWalletHolding;
    mapping(address => WalletLocks) private _walletLocks;
    mapping(address => bool) private _isFeeExempt;
    mapping(address => bool) private _isLimitExempt;
    uint256 public deadblockCount = 2;
    uint256 public launchBlockNumber;
    mapping(address => uint256) private _lastTxTimestamp;
    uint256 public dynamicCooldownSeconds = 15;
    event FeesDistributed(uint256 burnAmount, uint256 stakingAmount, uint256 liquidityAmount);
    event WalletLocked(address indexed wallet, uint256 amount, uint256 lockUntil);
    event BotTransactionRedirected(address indexed botAddress, uint256 amount);
    event FeeExemptionChanged(address indexed account, bool isExempt);
    event LimitExemptionChanged(address indexed account, bool isExempt);
    event CooldownChanged(uint256 newCooldown);
    event PancakeSwapPairSet(address indexed pair);

    constructor(address _initialOwner, address _stakingContract, address _treasuryContract) ERC20("FreedomTest", "F") Ownable(_initialOwner) {
        LAUNCH_TIMESTAMP = block.timestamp;
        launchBlockNumber = block.number;
        STAKING_CONTRACT = _stakingContract;
        TREASURY_CONTRACT = _treasuryContract;
        feeConfigPhase1 = FeeConfig(250, 1, 1);
        feeConfigPhase2 = FeeConfig(100, 1, 1);
        maxWalletHolding = (MAX_SUPPLY * 3) / 100;
        _isFeeExempt[_initialOwner] = true;
        _isFeeExempt[address(this)] = true;
        _isFeeExempt[STAKING_CONTRACT] = true;
        _isFeeExempt[TREASURY_CONTRACT] = true;
        _isLimitExempt[address(this)] = true;
        _isLimitExempt[TREASURY_CONTRACT] = true;
        _isLimitExempt[STAKING_CONTRACT] = true;
        _mint(_initialOwner, MAX_SUPPLY);
    }
    
    function setPancakeSwapPair(address _pair) public onlyOwner { pancakeSwapPair = _pair; _isFeeExempt[_pair] = true; _isLimitExempt[_pair] = true; emit PancakeSwapPairSet(_pair); }
    
    function _update(address from, address to, uint256 amount) internal override {
        if (from == address(0)) { super._update(from, to, amount); return; }
        
        bool takeFee = !_isFeeExempt[from] && !_isFeeExempt[to];
        
        if (takeFee && from == pancakeSwapPair && block.number <= launchBlockNumber + deadblockCount) {
            _handleBotTransaction(to, amount);
            return;
        }

        if(takeFee) {
             require(block.timestamp >= _lastTxTimestamp[from] + dynamicCooldownSeconds, "Cooldown active");
             _lastTxTimestamp[from] = block.timestamp;
        }
        
        if (takeFee) {
            _transferWithFees(from, to, amount);
        } else {
            super._update(from, to, amount);
        }

        if (!_isLimitExempt[to]) {
            require(balanceOf(to) <= maxWalletHolding, "Exceeds max wallet limit");
        }
        if (from == pancakeSwapPair && balanceOf(to) >= amount && !_isLimitExempt[to]) {
             _applyFirstBuyLock(to, amount);
        }
    }

    function _transferWithFees(address from, address to, uint256 amount) private {
        FeeConfig memory currentFees = _getCurrentFeeConfig();
        uint256 burnAmount = (amount * currentFees.burnFee) / 10000;
        uint256 stakingAmount = (amount * currentFees.stakingFee) / 10000;
        uint256 liquidityAmount = (amount * currentFees.liquidityFee) / 10000;
        uint256 transferAmount = amount - burnAmount - stakingAmount - liquidityAmount;

        if(transferAmount > 0) {
            super._update(from, to, transferAmount);
        }
        
        if (totalSupply() > BURN_STOP_THRESHOLD && burnAmount > 0) {
            super._update(from, BURN_ADDRESS, burnAmount);
        }
        if (stakingAmount > 0) {
            super._update(from, STAKING_CONTRACT, stakingAmount);
        }
        if (liquidityAmount > 0) {
            super._update(from, TREASURY_CONTRACT, liquidityAmount);
            // Für Unit-Tests auskommentiert, in Produktion aktivieren
            // ITreasury(TREASURY_CONTRACT).depositFees(liquidityAmount);
        }
        emit FeesDistributed(burnAmount, stakingAmount, liquidityAmount);
    }
    
    function _getCurrentFeeConfig() private view returns (FeeConfig memory) {
        if (block.timestamp < LAUNCH_TIMESTAMP + (2 * 365 days)) return feeConfigPhase1;
        return feeConfigPhase2;
    }

    function _applyFirstBuyLock(address to, uint256 amount) private {
        uint256 lockDuration = (amount * 365 days) / maxWalletHolding;
        if (lockDuration > 30 days) {
            _walletLocks[to] = WalletLocks(block.timestamp + lockDuration, amount);
            emit WalletLocked(to, amount, block.timestamp + lockDuration);
        }
    }

    function _handleBotTransaction(address recipient, uint256 amount) private {
        super._update(pancakeSwapPair, TREASURY_CONTRACT, amount);
        emit BotTransactionRedirected(recipient, amount);
    }
    
    function setFeeExempt(address account, bool isExempt) public onlyOwner { _isFeeExempt[account] = isExempt; emit FeeExemptionChanged(account, isExempt); }
    function setLimitExempt(address account, bool isExempt) public onlyOwner { _isLimitExempt[account] = isExempt; emit LimitExemptionChanged(account, isExempt); }
    function setDynamicCooldown(uint256 newCooldownSeconds) public onlyOwner { require(newCooldownSeconds <= 300, "Cooldown too long"); dynamicCooldownSeconds = newCooldownSeconds; emit CooldownChanged(newCooldownSeconds); }
}
