//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PurrNFT is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  struct MintData {
    address from;
    address to;
    uint256 timeStamp;
    string message;
    uint256 value;
    bool isRedeemed;
  }

  mapping(uint256 => MintData) private _mintData;
  mapping(address => bool) private _isMinter;
  address private _purrCoinAddress;
  address private _purrerFactoryAddress;

  constructor(address purrCoinAddress) ERC721("Purr", "PURR") {
    _purrCoinAddress = purrCoinAddress;
  }

  modifier onlyPurrer {
    require(_isMinter[_msgSender()], "PurrNFT: Only Purrers");
    _;
  }

  modifier onlyFactory {
    require(_msgSender() == _purrerFactoryAddress, "PurrCoin: No Access");
    _;
  }

  // Should only be called once by the owner
  function setPurrerFactoryAddress(address factory) external returns (bool) {
    _purrerFactoryAddress = factory;
    return true;
  }

  function addMinter(address minter) external onlyFactory returns (bool) {
    _isMinter[minter] = true;
    return true;
  }

  function mint(address to, string memory message, uint256 value) external onlyPurrer returns (bool) {
    require(_isMinter[to], "PurrNFT: Only Purrers");
    bool transferSuccess = IERC20(_purrCoinAddress).transferFrom(_msgSender(), address(this), value);
    require(transferSuccess, "PurrNFT: $PURR Transfer Failed");

    _mintData[_tokenIdTracker.current()] = MintData(_msgSender(), to, block.timestamp, message, value, false);
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
    return true;
  }
  
  function getMintData(uint256 tokenId) public view returns (MintData memory) {
    return _mintData[tokenId];
  }

  function redeem(uint256 tokenId) external returns (bool) {
    require(ownerOf(tokenId) == _msgSender(), "PurrNFT: This Token does not Belong to you");
    require(!_mintData[tokenId].isRedeemed, "PurrNFT: Tokens Already Redeemed");
    bool transferSuccess = IERC20(_purrCoinAddress).transfer(_msgSender(), _mintData[tokenId].value);
    require(transferSuccess, "PurrNFT: $PURR Transfer Failed");
    _mintData[tokenId].isRedeemed = true;
    return true;
  }

  function balanceOfCaller() public view returns (uint256) {
    return balanceOf(_msgSender());
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}

interface IERC20 {
  function transfer(address recipient, uint256 amount) external returns (bool);
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}