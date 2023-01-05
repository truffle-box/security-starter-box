// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ILiquidityValueCalculator.sol";
// import "@uniswap/v3-periphery/contracts/libraries/UniswapV3Library.sol";
// import "@uniswap/v3-core/contracts/interfaces/IUniswapV2Pair.sol";

abstract contract LiquidityValueCalculator is ILiquidityValueCalculator{
    address public factory;

    constructor (address _factory) {
        factory = _factory;
    }

    // function pairInfo(addres tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB, uint totalSupply) {
    //     IUniswapV2Pair pair = IUniswapV2Pair(UniswapV2Library.pairFor(factory, tokenA, tokenB));
    // }

}
