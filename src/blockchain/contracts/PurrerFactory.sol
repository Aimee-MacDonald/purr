//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract PurrerFactory is Ownable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;
  mapping(address => address) private userToPurrer;

  address private purrerImplementationAddress;
  address private purrCoinAddress;
  address private purrNFTAddress;

  constructor(address _purrerImplementationAddress, address _purrCoinAddress, address _purrNFTAddress) ERC721("Purrer", "PURR") {
    purrerImplementationAddress = _purrerImplementationAddress;
    purrCoinAddress = _purrCoinAddress;
    purrNFTAddress = _purrNFTAddress;
    IPurrCoin(_purrCoinAddress).setPurrerFactoryAddress(address(this));
    IPurrNFT(_purrNFTAddress).setPurrerFactoryAddress(address(this));
    IPurrCoin(_purrCoinAddress).addReciever(purrNFTAddress);
  }

  function join() external {
    require(userToPurrer[_msgSender()] == address(0), "Purrer: Only one Purrer per wallet");
    address cloneAddress = Clones.clone(purrerImplementationAddress);
    userToPurrer[_msgSender()] = cloneAddress;
    IPurrer(cloneAddress).init(purrCoinAddress, purrNFTAddress);
    IPurrer(cloneAddress).transferOwnership(_msgSender());
    IPurrCoin(purrCoinAddress).addMinter(cloneAddress);
    IPurrCoin(purrCoinAddress).addReciever(cloneAddress);
    IPurrNFT(purrNFTAddress).addMinter(cloneAddress);
    _safeMint(_msgSender(), _tokenIdTracker.current());
    _setTokenURI(_tokenIdTracker.current(), "https://whispurr.herokuapp.com/purrerData");
    _tokenIdTracker.increment();
  }

  function purrerAddress(address account) public view returns (address) {
    return userToPurrer[account];
  }
}

interface IPurrer {
  function init(address purrCoinAddress, address purrNFTAddress) external;
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