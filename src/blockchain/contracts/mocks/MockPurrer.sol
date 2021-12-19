//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract MockPurrer is ERC721Holder {
  bool public initialised;
  bool public wasTransferred;
  address public wasTransferredToAddress;
  address public owner;

  constructor() {
    initialised = false;
    wasTransferred = false;
  }

  function init(address purrCoinAddress, address purrNFTAddress, address lootFactoryAddress) external returns (bool) {
    initialised = true;
    return true;
  }

  function transferOwnership(address newOwner) public {
    wasTransferred = true;
    wasTransferredToAddress = newOwner;
  }
}