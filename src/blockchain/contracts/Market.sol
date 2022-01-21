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
  mapping(uint256 => uint256) private _indexes;
  uint256[] private _tokenIDs;

  constructor(address lootFactoryAddress, address purrCoinAddress) {
    _lootFactoryAddress = lootFactoryAddress;
    _purrCoinAddress = purrCoinAddress;
  }

  function listLoot(uint256 lootId, uint256 lootPrice) external returns (bool) {
    require(_lootFactoryAddress != address(0), "Market: LootFactoryAddress not set");

    ILootFactory(_lootFactoryAddress).safeTransferFrom(_msgSender(), address(this), lootId);
    
    _prices[lootId] = lootPrice;
    _owners[lootId] = _msgSender();
    _indexes[lootId] = totalListings;
    _tokenIDs.push(lootId);

    totalListings = totalListings + 1;

    return true;
  }

  function buyLoot(uint256 lootId) external returns (bool) {
    require(_lootFactoryAddress != address(0), "Market: LootFactoryAddress not set");
    require(_purrCoinAddress != address(0), "Market: PurrCoinAddress not set");

    IPurrCoin(_purrCoinAddress).transferFrom(_msgSender(), ownerOf(lootId), _prices[lootId]);
    ILootFactory(_lootFactoryAddress).safeTransferFrom(address(this), _msgSender(), lootId);
    
    uint256 tokenIndex = _indexes[lootId];
    uint256 lastTokenId = tokenAtIndex(totalListings - 1);
    _tokenIDs[tokenIndex] = lastTokenId;
    _indexes[lastTokenId] = tokenIndex;

    delete(_indexes[lootId]);
    delete(_owners[lootId]);
    delete(_prices[lootId]);
    _tokenIDs.pop();

    totalListings = totalListings - 1;
    
    return true;
  }
  
  function priceOf(uint256 lootId) external view returns (uint256) {
    return _prices[lootId];
  }

  function ownerOf(uint256 lootId) public view returns (address) {
    return _owners[lootId];
  }

  function tokenAtIndex(uint256 index) public view returns (uint256) {
    require(index < totalListings, "Market: Index out of bounds");
    
    return _tokenIDs[index];
  }
}

interface ILootFactory {
  function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

interface IPurrCoin {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}