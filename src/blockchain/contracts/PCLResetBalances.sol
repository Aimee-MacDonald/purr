//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/*
  All PurrCoin Upgrade Tokens *HAVE* to respect
  the ERC20 and PurrCoin memory layouts
  All previous memory slots need to be included and cannot be used to store different data
  All newly assigned variables need to be assigned to memory slots following the already established layout
*/

contract PCLResetBalances {
  // ERC20 Memory Layout
  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;
  uint256 private _totalSupply;
  string private _name;
  string private _symbol;

  // PurrCoin Memory Layout
  mapping(address => uint) internal _mintAllowance;
  mapping(address => bool) private _recievers;
  address private _purrerFactoryAddress;

  function consume(address purrerAddress) external {
    require(purrerAddress != address(0), "ERC20: burn from the zero address");
    
    uint256 accountBalance = _balances[purrerAddress];
    
    _balances[purrerAddress] = 0;
    _totalSupply -= accountBalance;

    _mintAllowance[purrerAddress] = 1000000000000000000;
  }
}