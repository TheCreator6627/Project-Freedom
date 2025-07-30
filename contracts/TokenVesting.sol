// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract TokenVesting is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable TOKEN;
    address public immutable BENEFICIARY;
    uint256 public immutable CLIFF_DURATION;
    uint256 public immutable TOTAL_VESTING_DURATION;
    uint256 public immutable VESTING_START_TIMESTAMP;
    uint256 public totalLockedAmount;
    uint256 public releasedAmount;
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event TokensDeposited(uint256 amount);
    constructor(address _tokenAddress, address _beneficiaryAddress, address _initialOwner) Ownable(_initialOwner) {
        require(_beneficiaryAddress != address(0), "Beneficiary is zero");
        require(_tokenAddress != address(0), "Token is zero");
        TOKEN = IERC20(_tokenAddress);
        BENEFICIARY = _beneficiaryAddress;
        VESTING_START_TIMESTAMP = block.timestamp;
        CLIFF_DURATION = 2 * 365 days;
        TOTAL_VESTING_DURATION = 7 * 365 days;
    }
    function release() public {
        require(msg.sender == BENEFICIARY, "Only beneficiary");
        uint256 releasableAmount = _calculateReleasableAmount();
        require(releasableAmount > 0, "No tokens due");
        releasedAmount += releasableAmount;
        TOKEN.safeTransfer(BENEFICIARY, releasableAmount);
        emit TokensReleased(BENEFICIARY, releasableAmount);
    }
    function _calculateReleasableAmount() private view returns (uint256) {
        if (block.timestamp < VESTING_START_TIMESTAMP + CLIFF_DURATION) return 0;
        if (block.timestamp >= VESTING_START_TIMESTAMP + TOTAL_VESTING_DURATION) return totalLockedAmount - releasedAmount;
        uint256 timeElapsed = block.timestamp - (VESTING_START_TIMESTAMP + CLIFF_DURATION);
        uint256 vestingPeriod = TOTAL_VESTING_DURATION - CLIFF_DURATION;
        uint256 vestedAmount = (totalLockedAmount * timeElapsed) / vestingPeriod;
        return vestedAmount - releasedAmount;
    }
    function getReleasableAmount() public view returns (uint256) { return _calculateReleasableAmount(); }
    function depositVestingTokens(uint256 _totalAmount) public onlyOwner {
        require(totalLockedAmount == 0, "Deposited already");
        totalLockedAmount = _totalAmount;
        TOKEN.safeTransferFrom(msg.sender, address(this), _totalAmount);
        emit TokensDeposited(_totalAmount);
    }
}
