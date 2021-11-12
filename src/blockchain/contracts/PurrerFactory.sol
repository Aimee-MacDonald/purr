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

  constructor(address _purrerImplementationAddress) ERC721("Purrer", "PURR") {
    purrerImplementationAddress = _purrerImplementationAddress;
  }

  function join() external {
    address cloneAddress = Clones.clone(purrerImplementationAddress);
    userToPurrer[_msgSender()] = cloneAddress;
    IPurrer(cloneAddress).init();
    IPurrer(cloneAddress).transferOwnership(_msgSender());
    _safeMint(_msgSender(), _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  function purrerAddress(address account) public view returns (address) {
    return userToPurrer[account];
  }
}

interface IPurrer{
  function init() external;
  function transferOwnership(address newOwner) external;
}