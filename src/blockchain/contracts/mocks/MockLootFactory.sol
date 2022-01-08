//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockLootFactory {
  bool public minted;
  bool public burned;
  address public lootAddress;
  bool public transferredToMarket;
  bool public transferredFromMarket;
  address public _marketAddress;

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

  function setMarketAddress(address marketAddress) external returns (bool) {
    _marketAddress = marketAddress;
    return true;
  }

  function safeTransferFrom(address from, address to, uint256 tokenId) external {
    require(_marketAddress != address(0), "MockLootFactory: Market Address not set");

    if(to == _marketAddress) {
      transferredToMarket = true;
    } else {
      transferredFromMarket = true;
    }
  }

  function approve(address to, uint256 tokenId) external {}
}