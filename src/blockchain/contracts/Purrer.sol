//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

contract Purrer is OwnableUpgradeable, ERC721HolderUpgradeable {
  address private _purrCoinAddress;
  address private _purrNFTAddress;

  function init(address purrCoinAddress, address purrNFTAddress) external initializer {
    OwnableUpgradeable.__Ownable_init();
    _purrCoinAddress = purrCoinAddress;
    _purrNFTAddress = purrNFTAddress;
  }

  function purr(address to, string memory message, uint256 value) external onlyOwner returns (bool) {
    IPurrCoin(_purrCoinAddress).approve(_purrNFTAddress, value);
    IPurrNFT(_purrNFTAddress).mint(to, message, value);
    return true;
  }

  function redeemPurr(uint256 tokenId) external onlyOwner returns (bool) {
    return IPurrNFT(_purrNFTAddress).redeem(tokenId);
  }
}

interface IPurrNFT {
  function mint(address to, string memory message, uint256 value) external;
  function redeem(uint256 tokenId) external returns (bool);
}

interface IPurrCoin {
  function approve(address spender, uint256 amount) external returns (bool);
}