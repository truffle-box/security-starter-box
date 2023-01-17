/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  LiquidityValueCalculator,
  LiquidityValueCalculatorInterface,
} from "../LiquidityValueCalculator";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "computeLiquidityShareValue",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenBAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class LiquidityValueCalculator__factory {
  static readonly abi = _abi;
  static createInterface(): LiquidityValueCalculatorInterface {
    return new utils.Interface(_abi) as LiquidityValueCalculatorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LiquidityValueCalculator {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as LiquidityValueCalculator;
  }
}
