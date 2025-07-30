// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
interface IAggregatorV3 { function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80); }
interface IPancakeRouter { function swapExactTokensForTokens(uint, uint, address[] calldata, address, uint) external returns (uint[] memory); }
contract Treasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    IERC20 public immutable F_TOKEN;
    IERC20 public immutable STABLECOIN;
    IPancakeRouter public immutable PANCAKE_ROUTER;
    IAggregatorV3 public immutable PRICE_FEED;
    address public immutable F_TOKEN_CONTRACT_ADDRESS;
    address public immutable STAKING_CONTRACT;
    address private immutable BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    uint256 public immutable REBURN_ACTIVATION_TIMESTAMP;
    uint256 public constant FINAL_SUPPLY_TARGET = 50000000 * 10**18;
    uint256 public softFloorPrice;
    uint256 public lastBuybackTimestamp;
    event ReburnExecuted(uint256 amountBought, uint256 amountBurned);
    event SoftFloorProtected(uint256 amountBought, int256 currentPrice);
    event SoftFloorPriceUpdated(uint256 newPrice);
    event FundsReceived(address indexed from, uint256 amount);
    constructor(address _fTokenAddress, address _stablecoinAddress, address _routerAddress, address _chainlinkFeedAddress, address _stakingContract, address _initialOwner) Ownable(_initialOwner) {
        F_TOKEN = IERC20(_fTokenAddress);
        STABLECOIN = IERC20(_stablecoinAddress);
        PANCAKE_ROUTER = IPancakeRouter(_routerAddress);
        PRICE_FEED = IAggregatorV3(_chainlinkFeedAddress);
        F_TOKEN_CONTRACT_ADDRESS = _fTokenAddress;
        STAKING_CONTRACT = _stakingContract;
        REBURN_ACTIVATION_TIMESTAMP = block.timestamp + (8 * 365 days);
        lastBuybackTimestamp = block.timestamp;
    }
    function executeReburn() external nonReentrant {
        require(block.timestamp >= REBURN_ACTIVATION_TIMESTAMP, "Re-burn not active");
        require(F_TOKEN.totalSupply() > FINAL_SUPPLY_TARGET, "Final supply target reached");
        require(block.timestamp >= lastBuybackTimestamp + 30 days, "Re-burn cooldown");
        uint256 stablecoinBalance = STABLECOIN.balanceOf(address(this));
        if (stablecoinBalance == 0) return;
        uint256 amountToSpend = (stablecoinBalance * 1) / 100;
        _buyAndBurn(amountToSpend);
        lastBuybackTimestamp = block.timestamp;
    }
    function protectSoftFloor() external nonReentrant {
        if (softFloorPrice == 0) return;
        int256 currentPrice = getFTokenPrice();
        if (currentPrice >= int256(softFloorPrice)) return;
        uint256 stablecoinBalance = STABLECOIN.balanceOf(address(this));
        if (stablecoinBalance == 0) return;
        uint256 amountToSpend = (stablecoinBalance * 5) / 100;
        _buyAndSupport(amountToSpend);
        emit SoftFloorProtected(amountToSpend, currentPrice);
    }
    function _buyAndBurn(uint256 _amountToSpend) private { uint256 boughtAmount = _swapStableForFToken(_amountToSpend, BURN_ADDRESS); if (boughtAmount > 0) emit ReburnExecuted(_amountToSpend, boughtAmount); }
    function _buyAndSupport(uint256 _amountToSpend) private { _swapStableForFToken(_amountToSpend, STAKING_CONTRACT); }
    function _swapStableForFToken(uint256 _amountIn, address _to) private returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = address(STABLECOIN);
        path[1] = address(F_TOKEN);
        STABLECOIN.approve(address(PANCAKE_ROUTER), _amountIn);
        uint[] memory amounts = PANCAKE_ROUTER.swapExactTokensForTokens(_amountIn, 0, path, _to, block.timestamp);
        return amounts[1];
    }
    function depositFees(uint256) external { require(msg.sender == F_TOKEN_CONTRACT_ADDRESS, "Only F Token contract"); }
    function setSoftFloorPrice(uint256 _newPrice) public onlyOwner { softFloorPrice = _newPrice; emit SoftFloorPriceUpdated(_newPrice); }
    function getFTokenPrice() public view returns (int256) { (, int256 price, , , ) = PRICE_FEED.latestRoundData(); return price * 10**10; }
}
