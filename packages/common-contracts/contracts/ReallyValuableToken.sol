// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ReallyValuableToken - The Token we have a lot of.
 */
contract ReallyValuableToken is ERC20 {

    uint public initialAmount = 1_000_000;

    // Decimals are set to 18 by default in `ERC20`
    constructor() ERC20("ReallyValuableToken", "RVT") {
        _mint(msg.sender, initialAmount);
    }

    /**
     * @notice Easy helper to mint a bunch of tokens to the Sender. Please don't ever do this IRL.
     */
    function mintABunch(uint amount) public {
        super._mint(msg.sender, amount);
    }

}
