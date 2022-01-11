//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockMarket {
  bool public wasListed;
  bool public wasBought;
  address private _purrCoinAddress;

  function listLoot(uint256 lootId, uint256 lootPrice) external returns (bool) {
    wasListed = true;
    return true;
  }

  function buyLoot(uint256 lootId) external returns (bool) {
    wasBought = true;
    return true;
  }

  function setPurrCoinAddress(address purrCoinAddress) external returns (bool) {
    _purrCoinAddress = purrCoinAddress;
  }

  function transferPurrCoin(address sender, address recipient, uint256 amount) external returns (bool) {
    IPurrCoin(_purrCoinAddress).transferFrom(sender, recipient, amount);
    return true;
  }
}

interface IPurrCoin {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}