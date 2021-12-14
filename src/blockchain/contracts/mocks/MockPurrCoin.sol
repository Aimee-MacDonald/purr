//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockPurrCoin {
  bool public transferred;
  bool public wasApproved;

  constructor() {
    transferred = false;
    wasApproved = false;
  }

  function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
    transferred = true;
    return true;
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    wasApproved = true;
    return true;
  }
}