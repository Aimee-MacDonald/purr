//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PurrCoin is ERC20 {
  mapping(address => uint) internal _mintAllowance;
  mapping(address => bool) private _recievers;
  address private _purrerFactoryAddress;

  constructor() ERC20("Purr", "PURR") {}

  modifier onlyFactory {
    require(_msgSender() == _purrerFactoryAddress, "PurrCoin: No Access");
    _;
  }

  function addMinter(address minter) external onlyFactory returns (bool) {
    _mintAllowance[minter] = 10 ** decimals();
    return true;
  }

  function addReciever(address reciever) external onlyFactory returns (bool) {
    _recievers[reciever] = true;
    return true;
  }

  // Should only be called once by the owner
  function setPurrerFactoryAddress(address factory) external returns (bool) {
    _purrerFactoryAddress = factory;
    return true;
  }

  function mintAllowanceOf(address account) public view returns (uint) {
    return _mintAllowance[account];
  }

  function _transfer(address from, address to, uint value) internal override {
    require(_recievers[to], "purrCoin: This address cannot recieve PURR");

    uint mintValue = value > _mintAllowance[from] ? _mintAllowance[from] : value;
    uint transferValue = value - mintValue;

    _mintAllowance[from] -= mintValue;

    if(mintValue > 0) _mint(to, mintValue);
    if(transferValue > 0) super._transfer(from, to, transferValue);
  }
}