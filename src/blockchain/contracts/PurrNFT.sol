//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./PurrCoin.sol";

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
  PurrCoin private _purrCoin;

  constructor() ERC721("Purr", "PURR") {}

  function setCoinContract(address newCoinAddress) public {
    _purrCoin = PurrCoin(newCoinAddress);
  }

  function mint(address to, string memory message, uint256 value) external returns (bool) {
    bool transferSuccess = _purrCoin.transferFrom(_msgSender(), address(this), value);
    require(transferSuccess, "$PURR Transfer Failed");

    _mintData[_tokenIdTracker.current()] = MintData(_msgSender(), to, block.timestamp, message, value, false);
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
    return true;
  }
  
  function getMintData(uint256 tokenId) public view returns (MintData memory) {
    return _mintData[tokenId];
  }

  function redeem(uint256 tokenId) public returns (bool) {
    require(ownerOf(tokenId) == _msgSender(), "This Token does not Belong to you");
    require(!_mintData[tokenId].isRedeemed, "Tokens Already Redeemed");
    bool transferSuccess = _purrCoin.transfer(_msgSender(), _mintData[tokenId].value);
    require(transferSuccess, "$PURR Transfer Failed");
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