//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Market is Context, ERC721Holder {
  uint256 public totalListings;
  address private _lootFactoryAddress;
  address private _purrCoinAddress;
  mapping(uint256 => uint256) private _prices;
  mapping(uint256 => address) private _owners;

  constructor(address lootFactoryAddress, address purrCoinAddress) {
    _lootFactoryAddress = lootFactoryAddress;
    _purrCoinAddress = purrCoinAddress;
  }

  function listLoot(uint256 lootId, uint256 lootPrice) external returns (bool) {
    require(_lootFactoryAddress != address(0), "Market: LootFactoryAddress not set");
    totalListings = totalListings + 1;
    ILootFactory(_lootFactoryAddress).safeTransferFrom(_msgSender(), address(this), lootId);
    _prices[lootId] = lootPrice;
    _owners[lootId] = _msgSender();

    return true;
  }

  function buyLoot(uint256 lootId) external returns (bool) {
    require(_lootFactoryAddress != address(0), "Market: LootFactoryAddress not set");
    require(_purrCoinAddress != address(0), "Market: PurrCoinAddress not set");

    IPurrCoin(_purrCoinAddress).transferFrom(_msgSender(), ownerOf(lootId), 1);
    totalListings = totalListings - 1;
    ILootFactory(_lootFactoryAddress).safeTransferFrom(address(this), _msgSender(), lootId);
    
    return true;
  }
  
  function priceOf(uint256 lootId) external view returns (uint256) {
    return _prices[lootId];
  }

  function ownerOf(uint256 lootId) public view returns (address) {
    return _owners[lootId];
  }
}

interface ILootFactory {
  function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

interface IPurrCoin {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}