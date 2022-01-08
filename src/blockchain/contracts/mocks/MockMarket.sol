//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockMarket {
  bool public wasListed;
  bool public wasBought;

  function listLoot(uint256 lootId) external returns (bool) {
    wasListed = true;
    return true;
  }

  function buyLoot(uint256 lootId) external returns (bool) {
    wasBought = true;
    return true;
  }
}