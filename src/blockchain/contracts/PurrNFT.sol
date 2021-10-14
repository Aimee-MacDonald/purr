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
  }

  mapping(uint256 => MintData) private _mintData;

  constructor() ERC721("Purr", "PURR") {}

  function mint(address to, string memory message) external returns (bool) {
    _mintData[_tokenIdTracker.current()] = MintData(_msgSender(), to, block.timestamp, message);
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
    return true;
  }
  
  function getMintData(uint256 tokenId) public view returns (MintData memory) {
    return _mintData[tokenId];
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}