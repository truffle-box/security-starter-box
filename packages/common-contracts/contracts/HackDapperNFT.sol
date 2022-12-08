// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HackDapper is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address public tokenAddress;
    ERC20 public PaymentToken;
    uint256 public MINT_PRICE = 10;

    constructor(address _tokenAddress) ERC721("HackDapper", "HakD") {
        tokenAddress = _tokenAddress;
        PaymentToken = ERC20(tokenAddress);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://hackd-dapp.truffle.labs";
    }

    /**
     * @notice safelyMint some tokens and ensure we have enough of the payment token allowance to buy.
     * you need MINT_PRICE (10) of these tokens to do this.
     */
    function safeMint(address to) public onlyOwner {
        require(PaymentToken.allowance(msg.sender, address(this)) == MINT_PRICE, "Not enough of Payment Token. Get Some more!");
        PaymentToken.transferFrom(msg.sender, address(this), MINT_PRICE);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}
