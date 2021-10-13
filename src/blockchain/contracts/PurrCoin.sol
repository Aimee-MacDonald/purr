//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract PurrCoin is ERC20 {
  mapping(address => uint) private _mintAllowance;
  address[] private _minters;

  constructor() ERC20("Purr", "PURR") {
    _mint(_msgSender(), 50 * 10 ** decimals());
    _minters.push(_msgSender());
    _mintAllowance[_msgSender()] = 30 * 10 ** decimals();
  }

  function balanceOfCaller() public view returns (uint) {
    return balanceOf(_msgSender());
  }

  function addMinter() public returns (bool) {
    _minters.push(_msgSender());
    _mintAllowance[_msgSender()] = 32 * 10 ** decimals();
    _mint(_msgSender(), 16 * 10 ** decimals());
    return true;
  }

  function mintAllowanceOf(address account) public view returns (uint) {
    return _mintAllowance[account];
  }

  function mintAllowanceOfCaller() public view returns (uint) {
    return _mintAllowance[_msgSender()];
  }

  function transfer(address to, uint value) public override returns (bool) {
    uint mintValue = value > _mintAllowance[_msgSender()] ? _mintAllowance[_msgSender()] : value;
    uint transferValue = value - mintValue;

    _mintAllowance[_msgSender()] -= mintValue;

    if(mintValue > 0) _mint(to, mintValue);
    if(transferValue > 0) _transfer(_msgSender(), to, transferValue);

    return true;
  }
}