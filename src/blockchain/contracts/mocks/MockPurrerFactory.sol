//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockPurrerFactory {
  mapping(address => bool) private _isPurrer;

  function isPurrer(address account) external returns (bool) {
    return _isPurrer[account];
  }

  function setPurrer(address account) external {
    _isPurrer[account] = true;
  }
}