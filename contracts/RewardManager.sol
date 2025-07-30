// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
contract RewardManager is ERC1155, Ownable {
    string public baseURI;
    mapping(uint256 => bytes32) public merkleRoots;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    mapping(uint256 => uint256) public mintedCounts;
    mapping(uint256 => uint256) public supplyLimits;
    address public royaltyRecipient;
    uint96 public royaltyFraction;
    event NFTClaimed(address indexed user, uint256 indexed tokenId);
    event MerkleRootUpdated(uint256 indexed tokenId, bytes32 newRoot);
    event BaseURIUpdated(string newURI);
    event RoyaltyInfoUpdated(address indexed receiver, uint96 fraction);
    constructor(string memory _initialBaseURI, address _initialOwner, address _royaltyReceiver) ERC1155(_initialBaseURI) Ownable(_initialOwner) {
        baseURI = _initialBaseURI;
        royaltyRecipient = _royaltyReceiver;
        royaltyFraction = 250;
        supplyLimits[2] = 200000;
        supplyLimits[3] = 100000;
        supplyLimits[4] = 80000;
        supplyLimits[5] = 50000;
    }
    function claimNFT(uint256 tokenId, bytes32[] calldata merkleProof) external {
        require(tokenId >= 1 && tokenId <= 5, "Invalid tokenId");
        require(!hasClaimed[tokenId][msg.sender], "Already claimed");
        if (supplyLimits[tokenId] > 0) { require(mintedCounts[tokenId] < supplyLimits[tokenId], "Supply limit reached"); }
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoots[tokenId], leaf), "Invalid proof");
        hasClaimed[tokenId][msg.sender] = true;
        mintedCounts[tokenId]++;
        _mint(msg.sender, tokenId, 1, "");
        emit NFTClaimed(msg.sender, tokenId);
    }
    function uri(uint256 tokenId) public view override returns (string memory) { return string(abi.encodePacked(baseURI, _toString(tokenId), ".json")); }
    function royaltyInfo(uint256, uint256 _salePrice) external view returns (address receiver, uint256 royaltyAmount) { return (royaltyRecipient, (_salePrice * royaltyFraction) / 10000); }
    function setMerkleRoot(uint256 tokenId, bytes32 _newRoot) public onlyOwner { require(tokenId >= 1 && tokenId <= 5, "Invalid tokenId"); merkleRoots[tokenId] = _newRoot; emit MerkleRootUpdated(tokenId, _newRoot); }
    function setBaseURI(string memory _newBaseURI) public onlyOwner { baseURI = _newBaseURI; emit BaseURIUpdated(_newBaseURI); }
    function setRoyaltyInfo(address _receiver, uint96 _fraction) public onlyOwner { royaltyRecipient = _receiver; royaltyFraction = _fraction; emit RoyaltyInfoUpdated(_receiver, _fraction); }
    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value; uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) { digits -= 1; buffer[digits] = bytes1(uint8(48 + uint256(value % 10))); value /= 10; }
        return string(buffer);
    }
}
