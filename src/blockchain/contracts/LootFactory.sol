//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LootFactory is ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;
  Counters.Counter private _implementationIdTracker;

  struct LootDetails {
    string name;
    address implementation;
  }

  address private _purrerFactoryAddress;
  mapping(uint256 => LootDetails) private _lootImplementations;
  mapping(uint256 => uint256) private _tokenToDetails;

  constructor() ERC721("Loot", "LOOT") {}

  function mint(address to, uint256 implementationId) external returns (bool) {
    require(_purrerFactoryAddress != address(0), "LootFactory: PurrerFactory was not set");
    require(IPurrerFactory(_purrerFactoryAddress).isPurrer(to), "LootFactory: Only Purrers can recieve Loot");

    _tokenToDetails[_tokenIdTracker.current()] = implementationId;
    _safeMint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();

    return true;
  }

  function setPurrerFactory(address purrerFactoryAddress) external {
    require(_purrerFactoryAddress == address(0), "LootFactory: PurrerFactory can only be set once");
    _purrerFactoryAddress = purrerFactoryAddress;
  }

  function burn(uint256 tokenId) external returns (bool) {
    _burn(tokenId);
    return true;
  }

  function addLootType(string memory implementationName, address implementationContract) external returns (bool) {
    _lootImplementations[_implementationIdTracker.current()] = LootDetails(implementationName, implementationContract);
    _implementationIdTracker.increment();
    return true;
  }

  function detailsOf(uint256 tokenId) public view returns (LootDetails memory) {
    return _lootImplementations[_tokenToDetails[tokenId]];
  }

  function addressOf(uint256 tokenId) external view returns (address) {
    LootDetails memory details = detailsOf(tokenId);
    return details.implementation;
  }
}

interface IPurrerFactory {
  function isPurrer(address account) external pure returns (bool);
}