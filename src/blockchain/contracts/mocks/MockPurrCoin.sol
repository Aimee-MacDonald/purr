//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockPurrCoin {
  bool public transferred;
  bool public wasApproved;
  bool public recieverAdded;
  bool public purrCoinsTransferred;
  bool public isMinter;

  constructor() {
    transferred = false;
    wasApproved = false;
    recieverAdded = false;
    purrCoinsTransferred = false;
    isMinter = false;
  }

  function transfer(address recipient, uint256 amount) external returns (bool) {
    purrCoinsTransferred = true;
    return true;
  }

  function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
    transferred = true;
    return true;
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    wasApproved = true;
    return true;
  }

  function addReciever(address account) external returns (bool) {
    recieverAdded = true;
  }

  function addMinter(address account) external {
    isMinter = true;
  }
}