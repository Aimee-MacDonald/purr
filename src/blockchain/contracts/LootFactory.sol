//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LootFactory is ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  address private _lootAddress;
  address private _purrerFactoryAddress;

  modifier onlyPurrerFactory {
    require(_msgSender() == _purrerFactoryAddress, "LootFactory: Only PurrerFactory can mint");
    _;
  }

  modifier onlyToPurrer(address to) {
    require(IPurrerFactory(_purrerFactoryAddress).isPurrer(to), "LootFactory: Purrers only");
    _;
  }

  constructor(address lootAddress) ERC721("Loot", "LOOT") {
    _lootAddress = lootAddress;
  }

  function setPurrerFactoryAddress(address purrerFactoryAddress) external returns (bool) {
    _purrerFactoryAddress = purrerFactoryAddress;
    return true;
  }

  function mint(address to) external onlyPurrerFactory onlyToPurrer(to) returns (bool) {
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
    return true;
  }

  function addressOf(uint256 tokenId) external view returns (address) {
    return _lootAddress;
  }

  function transfer(address from, address to, uint256 tokenId) external onlyToPurrer(to) returns (bool) {
    _safeTransfer(from, to, tokenId, "");
    return true;
  }

  function burn(uint256 tokenId) external returns (bool) {
    _burn(tokenId);
    return true;
  }
}

interface IPurrerFactory {
  function isPurrer(address account) external pure returns (bool);
}