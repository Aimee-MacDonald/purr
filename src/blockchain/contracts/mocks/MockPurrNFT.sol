//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockPurrNFT {
  bool public wasMinted;
  bool public wasRedeemed;

  constructor() {
    wasMinted = false;
    wasRedeemed = false;
  }

  function mint(address to, string memory message, uint256 value) external returns (bool) {
    wasMinted = true;
    return true;
  }
  
  function redeem(uint256 tokenId) external {
    wasRedeemed = true;
  }
}