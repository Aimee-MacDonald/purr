//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./PurrCoin.sol";

contract TIPurrCoin is PurrCoin {
  constructor() {
    _mint(_msgSender(), 50 * 10 ** decimals());
    _mintAllowance[_msgSender()] = 30 * 10 ** decimals();
  }
}