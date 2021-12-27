//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockLootFactory {
  bool public minted;
  bool public burned;
  address public lootAddress;

  function mint(address to, uint256 implementationId) external returns (bool) {
    minted = true;
    return true;
  }

  function burn(uint256 tokenId) external returns (bool) {
    burned = true;
    return true;
  }

  function setLootAddress(address loot) external {
    lootAddress = loot;
  }

  function addressOf(uint256 tokenId) external view returns (address) {
    require(lootAddress != address(0), "lootAddress not set");
    return lootAddress;
  }
}