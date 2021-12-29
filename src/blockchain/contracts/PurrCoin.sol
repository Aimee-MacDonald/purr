//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PurrCoin is ERC20 {
  mapping(address => uint256) private _mintAllowance;
  mapping(address => bool) private _recievers;
  mapping(address => uint256) private _totalRecieved;
  mapping(address => uint256) private _maxMintAllowance;
  address private _lootFactoryAddress;
  address private _purrerFactoryAddress;

  constructor(address lootFactoryAddress) ERC20("Purr", "PURR") {
    _lootFactoryAddress = lootFactoryAddress;
  }

  function addMinter(address account) external {
    _recievers[account] = true;
    _mintAllowance[account] = 1;
    _maxMintAllowance[account] = 1;
  }

  function addReciever(address reciever) external {
    _recievers[reciever] = true;
  }

  function mintAllowanceOf(address account) external view returns (uint256) {
    return _mintAllowance[account];
  }

  function maxMintAllowanceOf(address account) external view returns (uint256) {
    return _maxMintAllowance[account];
  }

  function totalRecievedBy(address account) external view returns (uint256) {
    return _totalRecieved[account];
  }

  function setPurrerFactory(address purrerFactoryAddress) external {
    require(_purrerFactoryAddress == address(0), "LootFactory: PurrerFactory can only be set once");
    _purrerFactoryAddress = purrerFactoryAddress;
  }

  function _transfer(address from, address to, uint value) internal override {
    require(_recievers[to], "PurrCoin: This address cannot recieve PurrCoin");
    require(_purrerFactoryAddress != address(0), "PurrCoin: PurrerFactory was not set");

    uint mintValue = value > _mintAllowance[from] ? _mintAllowance[from] : value;
    uint transferValue = value - mintValue;

    _mintAllowance[from] -= mintValue;

    if(mintValue > 0) _mint(to, mintValue);
    if(transferValue > 0) super._transfer(from, to, transferValue);

    _totalRecieved[to] += value;

    if(IPurrerFactory(_purrerFactoryAddress).isPurrer(to)) {
      if(_totalRecieved[to] == 5) {
        ILootFactory(_lootFactoryAddress).mint(to, 1);
      }
    }

    if(IPurrerFactory(_purrerFactoryAddress).isPurrer(from)) {
      if(balanceOf(from) == 0 && _mintAllowance[from] == 0) {
        ILootFactory(_lootFactoryAddress).mint(from, 0);
      }
    }
  }

  function runLootLogic(address purrerAddress, address lootAddress) external returns (bool) {
    lootAddress.delegatecall(abi.encodeWithSignature("consume(address)", purrerAddress));
    return true;
  }
}

interface ILootFactory {
  function mint(address to, uint256 implementationId) external returns (bool);
}

interface IPurrerFactory {
  function isPurrer(address account) external view returns (bool);
}