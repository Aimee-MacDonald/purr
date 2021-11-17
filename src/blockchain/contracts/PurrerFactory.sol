//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract PurrerFactory is Ownable, ERC721 {
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
  }

  function join() external {
    address cloneAddress = Clones.clone(purrerImplementationAddress);
    userToPurrer[_msgSender()] = cloneAddress;
    IPurrer(cloneAddress).init(purrCoinAddress, purrNFTAddress);
    IPurrer(cloneAddress).transferOwnership(_msgSender());
    IPurrCoin(purrCoinAddress).addMinter(cloneAddress);
    _safeMint(_msgSender(), _tokenIdTracker.current());
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
}