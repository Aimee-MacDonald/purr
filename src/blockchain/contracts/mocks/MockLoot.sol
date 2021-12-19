//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockLoot {
  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;
  uint256 private _totalSupply;
  string private _name;
  string private _symbol;

  mapping(address => uint) internal _mintAllowance;
  mapping(address => bool) private _recievers;
  address private _lootFactoryAddress;
  address private _purrerFactoryAddress;

  function consume(address purrerAddress) external {
    require(purrerAddress != address(0), "ERC20: burn from the zero address");
    
    uint256 accountBalance = _balances[purrerAddress];
    
    _balances[purrerAddress] = 0;
    _totalSupply -= accountBalance;

    _mintAllowance[purrerAddress] = 5;
  }
}