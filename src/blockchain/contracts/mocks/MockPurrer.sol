//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockPurrer {
  bool public initialised;
  bool public wasTransferred;
  address public wasTransferredToAddress;
  address public owner;

  constructor() {
    initialised = false;
    wasTransferred = false;
  }

  function init(address purrCoinAddress, address purrNFTAddress) external returns (bool) {
    initialised = true;
    return true;
  }

  function transferOwnership(address newOwner) public {
    wasTransferred = true;
    wasTransferredToAddress = newOwner;
  }
}