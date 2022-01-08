//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Market is Context, ERC721Holder {
  uint256 public totalListings;
  address private _lootFactoryAddress;

  constructor(address lootFactoryAddress) {
    _lootFactoryAddress = lootFactoryAddress;
  }

  function listLoot(uint256 lootId) external returns (bool) {
    require(_lootFactoryAddress != address(0), "Market: LootFactoryAddress not set");
    totalListings = totalListings + 1;
    ILootFactory(_lootFactoryAddress).safeTransferFrom(_msgSender(), address(this), lootId);

    return true;
  }

  function buyLoot(uint256 lootId) external returns (bool) {
    require(_lootFactoryAddress != address(0), "Market: LootFactoryAddress not set");
    totalListings = totalListings - 1;
    ILootFactory(_lootFactoryAddress).safeTransferFrom(address(this), _msgSender(), lootId);
    
    return true;
  }
}

interface ILootFactory {
  function safeTransferFrom(address from, address to, uint256 tokenId) external;
}