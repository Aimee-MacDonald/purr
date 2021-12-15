//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PurrNFT is ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  mapping(uint256 => MintData) private _mintData;
  mapping(uint256 => string) private _tokenURIs;

  address private _purrCoinAddress;
  
  struct MintData {
    address from;
    address to;
    uint256 timeStamp;
    string message;
    uint256 value;
    bool isRedeemed;
  }

  constructor(address purrCoinAddress) ERC721("Purr", "PURR") {
    _purrCoinAddress = purrCoinAddress;
  }

  function mint(address to, string memory message, uint256 value) external returns (bool) {
    //require(_isMinter[to], "PurrNFT: Only Purrers");
    bool transferSuccess = IPurrCoin(_purrCoinAddress).transferFrom(_msgSender(), address(this), value);
    require(transferSuccess, "PurrNFT: $PURR Transfer Failed");

    _safeMint(to, _tokenIdTracker.current());
    _mintData[_tokenIdTracker.current()] = MintData(_msgSender(), to, block.timestamp, message, value, false);
    _setTokenURI(_tokenIdTracker.current(), "https://whispurr.herokuapp.com/purrNFTData");
    _tokenIdTracker.increment();
    return true;
  }

  function getMintData(uint256 tokenId) public view returns (MintData memory) {
    return _mintData[tokenId];
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
    string memory _tokenURI = _tokenURIs[tokenId];
    string memory base = _baseURI();

    // If there is no base URI, return the token URI.
    if (bytes(base).length == 0) {
      return _tokenURI;
    }
    
    // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
    if (bytes(_tokenURI).length > 0) {
      return string(abi.encodePacked(base, _tokenURI));
    }
    
    return super.tokenURI(tokenId);
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }

  function redeem(uint256 tokenId) external {
    require(ownerOf(tokenId) == _msgSender(), "PurrNFT: Only owner can redeem");
    require(!_mintData[tokenId].isRedeemed, "PurrNFT: Token already redeemed");
    _mintData[tokenId].isRedeemed = true;
  }
}

interface IPurrCoin {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

/* 
contract PurrNFT is ERC721Enumerable {
  mapping(address => bool) private _isMinter;
  address private _purrerFactoryAddress;

  modifier onlyPurrer {
    require(_isMinter[_msgSender()], "PurrNFT: Only Purrers");
    _;
  }

  modifier onlyFactory {
    require(_msgSender() == _purrerFactoryAddress, "PurrCoin: No Access");
    _;
  }

  // Should only be called once by the owner
  function setPurrerFactoryAddress(address factory) external returns (bool) {
    _purrerFactoryAddress = factory;
    return true;
  }

  function addMinter(address minter) external onlyFactory returns (bool) {
    _isMinter[minter] = true;
    return true;
  }

  function redeem(uint256 tokenId) external returns (bool) {
    require(ownerOf(tokenId) == _msgSender(), "PurrNFT: This Token does not Belong to you");
    require(!_mintData[tokenId].isRedeemed, "PurrNFT: Tokens Already Redeemed");
    bool transferSuccess = IERC20(_purrCoinAddress).transfer(_msgSender(), _mintData[tokenId].value);
    require(transferSuccess, "PurrNFT: $PURR Transfer Failed");
    _mintData[tokenId].isRedeemed = true;
    return true;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
 */