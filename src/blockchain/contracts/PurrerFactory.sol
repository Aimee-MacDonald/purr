//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract PurrerFactory is Ownable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  mapping(address => address) private _userToPurrerAddress;
  address private _purrerImplementationAddress;
  address private _purrCoinAddress;
  address private _purrNFTAddress;

  constructor(address purrerImplementationAddress, address purrCoinAddress, address purrNFTAddress) ERC721("Purrer", "PURR") {
    _purrerImplementationAddress = purrerImplementationAddress;
    _purrCoinAddress = purrCoinAddress;
    _purrNFTAddress = purrNFTAddress;
  }

  /*
    _userToPurrerId[_msgSender()] = _tokenIdTracker.current();
    _isPurrer[cloneAddress] = true;

    IPurrCoin(purrCoinAddress).addMinter(cloneAddress);
    IPurrCoin(purrCoinAddress).addReciever(cloneAddress);

    IPurrNFT(purrNFTAddress).addMinter(cloneAddress);
  */

  function mint(address to) external returns (bool) {
    require(_userToPurrerAddress[to] == address(0), "Purrer: Only one Purrer per wallet");
    require(_purrerImplementationAddress != address(0), "PurrerFactory: No implementation contract");

    address cloneAddress = Clones.clone(_purrerImplementationAddress);
    _userToPurrerAddress[to] = cloneAddress;

    IPurrer(cloneAddress).init(_purrCoinAddress, _purrNFTAddress);
    IPurrer(cloneAddress).transferOwnership(to);

    IPurrCoin(_purrCoinAddress).addMinter(cloneAddress);

    _safeMint(to, _tokenIdTracker.current());
    _setTokenURI(_tokenIdTracker.current(), "https://whispurr.herokuapp.com/purrerData");
    _tokenIdTracker.increment();
    
    return true;
  }

  function addressOf(address account) external view returns (address) {
    return _userToPurrerAddress[account];
  }
}

interface IPurrCoin {
  function addMinter(address account) external;
}

interface IPurrer {
  function init(address purrCoinAddress, address purrNFTAddress) external returns (bool);
  function transferOwnership(address newOwner) external;
  function owner() external view returns (address);
}

/*
contract PurrerFactory is Ownable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;
  mapping(address => address) private _userToPurrerAddress;
  mapping(address => uint256) private _userToPurrerId;
  mapping(address => bool) private _isPurrer;

  address private purrerImplementationAddress;
  address private purrCoinAddress;
  address private purrNFTAddress;
  address private lootFactoryAddress;

  constructor(address _purrerImplementationAddress, address _purrCoinAddress, address _purrNFTAddress, address _lootFactoryAddress) ERC721("Purrer", "PURR") {
    purrerImplementationAddress = _purrerImplementationAddress;
    purrCoinAddress = _purrCoinAddress;
    purrNFTAddress = _purrNFTAddress;
    lootFactoryAddress = _lootFactoryAddress;
    IPurrCoin(_purrCoinAddress).setPurrerFactoryAddress(address(this));
    IPurrNFT(_purrNFTAddress).setPurrerFactoryAddress(address(this));
    IPurrCoin(_purrCoinAddress).addReciever(purrNFTAddress);
  }

  function join() external {
    require(_userToPurrerAddress[_msgSender()] == address(0), "Purrer: Only one Purrer per wallet");

    address cloneAddress = Clones.clone(purrerImplementationAddress);

    _userToPurrerAddress[_msgSender()] = cloneAddress;
    _userToPurrerId[_msgSender()] = _tokenIdTracker.current();
    _isPurrer[cloneAddress] = true;

    IPurrer(cloneAddress).init(purrCoinAddress, purrNFTAddress, lootFactoryAddress);
    IPurrer(cloneAddress).transferOwnership(_msgSender());

    IPurrCoin(purrCoinAddress).addMinter(cloneAddress);
    IPurrCoin(purrCoinAddress).addReciever(cloneAddress);

    IPurrNFT(purrNFTAddress).addMinter(cloneAddress);
    
    _safeMint(_msgSender(), _tokenIdTracker.current());
    _setTokenURI(_tokenIdTracker.current(), "https://whispurr.herokuapp.com/purrerData");
    _tokenIdTracker.increment();
  }

  function purrerAddress(address account) public view returns (address) {
    return _userToPurrerAddress[account];
  }

  function purrerId(address account) public view returns (uint256) {
    return _userToPurrerId[account];
  }

  function isPurrer(address account) external view returns (bool) {
    return _isPurrer[account];
  }

  function mintLoot(address to) external returns (bool) {
    ILootFactory(lootFactoryAddress).mint(to);
    return true;
  }
}

interface IPurrer {
  function init(address purrCoinAddress, address purrNFTAddress, address lootFactoryAddress) external;
  function transferOwnership(address newOwner) external;
}

interface IPurrCoin {
  function addMinter(address newMinter) external;
  function addReciever(address reciever) external;
  function setPurrerFactoryAddress(address factory) external;
}

interface IPurrNFT {
  function addMinter(address purrer) external;
  function setPurrerFactoryAddress(address factory) external;
}

interface ILootFactory {
  function mint(address to) external returns (bool);
} */