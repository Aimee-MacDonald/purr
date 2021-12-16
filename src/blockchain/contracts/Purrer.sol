//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

contract Purrer is OwnableUpgradeable, ERC721HolderUpgradeable {
  address private _purrCoinAddress;
  address private _purrNFTAddress;

  function init(address purrCoinAddress, address purrNFTAddress) external initializer returns (bool) {
    OwnableUpgradeable.__Ownable_init();
    _purrCoinAddress = purrCoinAddress;
    _purrNFTAddress = purrNFTAddress;
    return true;
  }

  function purr(address to, string memory message, uint256 value) external onlyOwner returns (bool) {
    IPurrCoin(_purrCoinAddress).approve(_purrNFTAddress, value);
    IPurrNFT(_purrNFTAddress).mint(to, message, value);
    return true;
  }

  function redeemPurr(uint256 tokenId) external returns (bool) {
    IPurrNFT(_purrNFTAddress).redeem(tokenId);
    return true;
  }
}

interface IPurrCoin {
  function approve(address spender, uint256 amount) external returns (bool);
}

interface IPurrNFT {
  function mint(address to, string memory message, uint256 value) external returns (bool);
  function redeem(uint256 tokenId) external;
}

/*
contract Purrer is OwnableUpgradeable, ERC721HolderUpgradeable {
  address private _lootFactoryAddress;

  function init(address purrCoinAddress, address purrNFTAddress, address lootFactoryAddress) external initializer {
    _lootFactoryAddress = lootFactoryAddress;
  }

  function consumeLoot(uint256 tokenId) external returns (bool) {
    address lootAddress = ILootFactory(_lootFactoryAddress).addressOf(tokenId);
    IPurrCoin(_purrCoinAddress).consumeLoot(address(this), lootAddress);
    ILootFactory(_lootFactoryAddress).burn(tokenId);
    return true;
  }
}

interface IPurrNFT {
  function mint(address to, string memory message, uint256 value) external;
  function redeem(uint256 tokenId) external returns (bool);
}

interface IPurrCoin {
  function approve(address spender, uint256 amount) external returns (bool);
  function consumeLoot(address purrerAddress, address lootAddress) external returns (bool);
}

interface ILootFactory {
  function addressOf(uint256 tokenId) external view returns (address);
  function burn(uint256 tokenId) external returns (bool);
} */