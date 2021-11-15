//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract PurrCoin is ERC20 {
  mapping(address => uint) private _mintAllowance;

  constructor() ERC20("Purr", "PURR") {
    _mint(_msgSender(), 50 * 10 ** decimals());
    _mintAllowance[_msgSender()] = 30 * 10 ** decimals();
  }

  function balanceOfCaller() public view returns (uint) {
    return balanceOf(_msgSender());
  }

  function addMinter(address newMinter) external returns (bool) {
    _mintAllowance[newMinter] = 10 ** decimals();
    return true;
  }

  function mintAllowanceOf(address account) public view returns (uint) {
    return _mintAllowance[account];
  }

  function mintAllowanceOfCaller() public view returns (uint) {
    return _mintAllowance[_msgSender()];
  }

  function _transfer(address from, address to, uint value) internal override {
    uint mintValue = value > _mintAllowance[from] ? _mintAllowance[from] : value;
    uint transferValue = value - mintValue;

    _mintAllowance[from] -= mintValue;

    if(mintValue > 0) _mint(to, mintValue);
    if(transferValue > 0) super._transfer(from, to, transferValue);
  }
}