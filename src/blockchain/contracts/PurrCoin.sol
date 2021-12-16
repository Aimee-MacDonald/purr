//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PurrCoin is ERC20 {
  mapping(address => uint) internal _mintAllowance;
  mapping(address => bool) private _recievers;

  constructor() ERC20("Purr", "PURR") {}

  function addMinter(address account) external {
    _recievers[account] = true;
    _mintAllowance[account] = 1;
  }

  function addReciever(address reciever) external {
    _recievers[reciever] = true;
  }

  function mintAllowanceOf(address account) external view returns (uint256) {
    return _mintAllowance[account];
  }

  function _transfer(address from, address to, uint value) internal override {
    require(_recievers[to], "PurrCoin: This address cannot recieve PurrCoin");

    uint mintValue = value > _mintAllowance[from] ? _mintAllowance[from] : value;
    uint transferValue = value - mintValue;

    _mintAllowance[from] -= mintValue;

    if(mintValue > 0) _mint(to, mintValue);
    if(transferValue > 0) super._transfer(from, to, transferValue);
  }
}

/*
contract PurrCoin is ERC20 {
  mapping(address => bool) private _recievers;
  address private _purrerFactoryAddress;

  modifier onlyFactory {
    require(_msgSender() == _purrerFactoryAddress, "PurrCoin: No Access");
    _;
  }

  

  // Should only be called once by the owner
  function setPurrerFactoryAddress(address factory) external returns (bool) {
    _purrerFactoryAddress = factory;
    return true;
  }

  // Should Only be called by Purrer
  function consumeLoot(address purrerAddress, address lootAddress) external returns (bool) {
    lootAddress.delegatecall(abi.encodeWithSignature("consume(address)", purrerAddress));
    return true;
  }
} */