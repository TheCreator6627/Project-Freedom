// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Staking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    struct StakerInfo { uint256 amount; uint256 since; uint256 unlocksOn; bool isLpStaker; }
    IERC20 public immutable F_TOKEN;
    uint256 public totalStaked;
    uint256 public constant STAKING_HARD_CAP = 100000000 * 10**18;
    mapping(address => StakerInfo) public stakers;
    mapping(address => bool) public isLpStaker;
    uint256[] public normalRates = [50, 100, 200, 300];
    uint256[] public lpRates = [100, 200, 400, 600];
    event Staked(address indexed user, uint256 amount, uint256 unlocksOn);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event LpStatusChanged(address indexed user, bool isLp);
    constructor(address _fTokenAddress, address _initialOwner) Ownable(_initialOwner) { F_TOKEN = IERC20(_fTokenAddress); }
    function stake(uint256 amount, uint256 durationInDays) external nonReentrant {
        require(amount > 0, "Staking: amount > 0");
        require(stakers[msg.sender].amount == 0, "Staking: already staking");
        require(totalStaked + amount <= STAKING_HARD_CAP, "Staking: hard cap reached");
        uint256 unlockDuration = _getDurationInSeconds(durationInDays);
        require(unlockDuration > 0, "Staking: invalid duration");
        totalStaked += amount;
        stakers[msg.sender] = StakerInfo(amount, block.timestamp, block.timestamp + unlockDuration, isLpStaker[msg.sender]);
        F_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount, stakers[msg.sender].unlocksOn);
    }
    function unstake() external nonReentrant {
        StakerInfo storage staker = stakers[msg.sender];
        require(staker.amount > 0, "Unstaking: not staking");
        require(block.timestamp >= staker.unlocksOn, "Unstaking: lock period not over");
        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = staker.amount + reward;
        totalStaked -= staker.amount;
        delete stakers[msg.sender];
        F_TOKEN.safeTransfer(msg.sender, totalAmount);
        emit Unstaked(msg.sender, staker.amount, reward);
    }
    function setLpStaker(address user, bool isLp) public onlyOwner { isLpStaker[user] = isLp; emit LpStatusChanged(user, isLp); }
    function calculateReward(address stakerAddress) public view returns (uint256) {
        StakerInfo memory staker = stakers[stakerAddress];
        if (staker.amount == 0) return 0;
        uint256 stakingDuration = staker.unlocksOn - staker.since;
        uint256[] memory rates = staker.isLpStaker ? lpRates : normalRates;
        uint256 rateBps = 0;
        if (stakingDuration >= (365 days)) rateBps = rates[3];
        else if (stakingDuration >= (180 days)) rateBps = rates[2];
        else if (stakingDuration >= (90 days)) rateBps = rates[1];
        else if (stakingDuration >= (30 days)) rateBps = rates[0];
        return (staker.amount * rateBps) / 10000;
    }
    function _getDurationInSeconds(uint256 durationInDays) private pure returns (uint256) {
        if (durationInDays == 30) return 30 days;
        if (durationInDays == 90) return 90 days;
        if (durationInDays == 180) return 180 days;
        if (durationInDays == 365) return 365 days;
        return 0;
    }
}
