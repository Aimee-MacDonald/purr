//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

contract Purrer is OwnableUpgradeable, ERC721HolderUpgradeable {
  address private _purrCoinAddress;
  address private _purrNFTAddress;
  address private _lootFactoryAddress;

  function init(address purrCoinAddress, address purrNFTAddress, address lootFactoryAddress) external initializer returns (bool) {
    OwnableUpgradeable.__Ownable_init();
    _purrCoinAddress = purrCoinAddress;
    _purrNFTAddress = purrNFTAddress;
    _lootFactoryAddress = lootFactoryAddress;
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

  function consumeLoot(uint256 tokenId) external {
    address lootAddress = ILootFactory(_lootFactoryAddress).addressOf();
    IPurrCoin(_purrCoinAddress).runLootLogic(address(this), lootAddress);
    ILootFactory(_lootFactoryAddress).burn(0);
  }
}

interface IPurrCoin {
  function approve(address spender, uint256 amount) external returns (bool);
  function runLootLogic(address purrerAddress, address lootAddress) external;
}

interface IPurrNFT {
  function mint(address to, string memory message, uint256 value) external returns (bool);
  function redeem(uint256 tokenId) external;
}

interface ILootFactory {
  function addressOf() external view returns (address);
  function burn(uint256 tokenId) external returns (bool);
}