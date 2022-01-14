//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PurrerFactory is Ownable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  mapping(address => address) private _userToPurrerAddress;
  mapping(address => bool) private _isPurrer;
  mapping(address => uint256) private _ownerToToken;
  address private _purrerImplementationAddress;
  address private _purrCoinAddress;
  address private _purrNFTAddress;
  address private _lootFactoryAddress;
  address private _marketAddress;

  constructor(address purrerImplementationAddress, address purrCoinAddress, address purrNFTAddress, address lootFactoryAddress, address marketAddress) ERC721("Purrer", "PURR") {
    _purrerImplementationAddress = purrerImplementationAddress;
    _purrCoinAddress = purrCoinAddress;
    _purrNFTAddress = purrNFTAddress;
    _lootFactoryAddress = lootFactoryAddress;
    _marketAddress = marketAddress;
  }

  function mint(address to) external returns (bool) {
    require(_userToPurrerAddress[to] == address(0), "Purrer: Only one Purrer per wallet");
    require(_purrerImplementationAddress != address(0), "PurrerFactory: No implementation contract");

    address cloneAddress = Clones.clone(_purrerImplementationAddress);
    _userToPurrerAddress[to] = cloneAddress;
    _isPurrer[cloneAddress] = true;
    _ownerToToken[to] = _tokenIdTracker.current();

    IPurrer(cloneAddress).init(_purrCoinAddress, _purrNFTAddress, _lootFactoryAddress, _marketAddress);
    IPurrer(cloneAddress).transferOwnership(to);

    IPurrCoin(_purrCoinAddress).addMinter(cloneAddress);

    _safeMint(to, _tokenIdTracker.current());
    _setTokenURI(_tokenIdTracker.current(), "http://localhost:1248/purrerData");
    _tokenIdTracker.increment();
    
    return true;
  }

  function addressOf(address account) public view returns (address) {
    return _userToPurrerAddress[account];
  }

  function isPurrer(address account) external view returns (bool) {
    return _isPurrer[account];
  }

  function tokenOwnedBy(address account) external view returns (uint256) {
    require(_isPurrer[_userToPurrerAddress[account]], "PurrerFactory: Account is not a Purrer");
    return _ownerToToken[account];
  }
}

interface IPurrCoin {
  function addMinter(address account) external;
}

interface IPurrer {
  function init(address purrCoinAddress, address purrNFTAddress, address lootFactoryAddress, address _marketAddress) external returns (bool);
  function transferOwnership(address newOwner) external;
  function owner() external view returns (address);
}