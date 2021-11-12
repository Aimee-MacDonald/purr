//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Purrer is OwnableUpgradeable {
  function init() external initializer {
    OwnableUpgradeable.__Ownable_init();
  }
}