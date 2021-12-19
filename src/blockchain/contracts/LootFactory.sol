//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LootFactory is ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  address private _lootAddress;
  address private _purrerFactoryAddress;

  constructor(address lootAddress) ERC721("Loot", "LOOT") {
    _lootAddress = lootAddress;
  }

  function mint(address to) external returns (bool) {
    require(_purrerFactoryAddress != address(0), "LootFactory: PurrerFactory was not set");
    require(IPurrerFactory(_purrerFactoryAddress).isPurrer(to), "LootFactory: Only Purrers can recieve Loot");

    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();

    return true;
  }

  function setPurrerFactory(address purrerFactoryAddress) external {
    require(_purrerFactoryAddress == address(0), "LootFactory: PurrerFactory can only be set once");
    _purrerFactoryAddress = purrerFactoryAddress;
  }

  function addressOf() external view returns (address) {
    return _lootAddress;
  }

  function burn(uint256 tokenId) external returns (bool) {
    _burn(tokenId);
    return true;
  }
}

interface IPurrerFactory {
  function isPurrer(address account) external pure returns (bool);
}