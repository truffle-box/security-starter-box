// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title DappCoinToken - The Token we think we are wanting to use.
 */
contract DappCoinToken is ERC20 {

    uint public maxMintAmount = 100;

    // Decimals are set to 18 by default in `ERC20`
    constructor() ERC20("DappCoinTokens", "DCT") {
        _mint(msg.sender, type(uint256).max);
    }

    /**
     * @notice mint some tokens
     */
    function buySome(uint amount) public payable {
        require( msg.value == 1 ether, "You need to pay 1 ETH to get some magic tokens..");
        require( amount < maxMintAmount, "You have exceeded the maxMintAmount");
        _mint(msg.sender, amount);
    }
}
