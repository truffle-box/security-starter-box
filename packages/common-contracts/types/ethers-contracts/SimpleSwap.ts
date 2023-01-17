/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface SimpleSwapInterface extends utils.Interface {
  functions: {
    "DAI()": FunctionFragment;
    "WETH9()": FunctionFragment;
    "feeTier()": FunctionFragment;
    "swapRouter()": FunctionFragment;
    "swapWETHForDAI(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "DAI"
      | "WETH9"
      | "feeTier"
      | "swapRouter"
      | "swapWETHForDAI"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "DAI", values?: undefined): string;
  encodeFunctionData(functionFragment: "WETH9", values?: undefined): string;
  encodeFunctionData(functionFragment: "feeTier", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "swapRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "swapWETHForDAI",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "DAI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "WETH9", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeTier", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swapRouter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "swapWETHForDAI",
    data: BytesLike
  ): Result;

  events: {};
}

export interface SimpleSwap extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SimpleSwapInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DAI(overrides?: CallOverrides): Promise<[string]>;

    WETH9(overrides?: CallOverrides): Promise<[string]>;

    feeTier(overrides?: CallOverrides): Promise<[number]>;

    swapRouter(overrides?: CallOverrides): Promise<[string]>;

    swapWETHForDAI(
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  DAI(overrides?: CallOverrides): Promise<string>;

  WETH9(overrides?: CallOverrides): Promise<string>;

  feeTier(overrides?: CallOverrides): Promise<number>;

  swapRouter(overrides?: CallOverrides): Promise<string>;

  swapWETHForDAI(
    amountIn: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DAI(overrides?: CallOverrides): Promise<string>;

    WETH9(overrides?: CallOverrides): Promise<string>;

    feeTier(overrides?: CallOverrides): Promise<number>;

    swapRouter(overrides?: CallOverrides): Promise<string>;

    swapWETHForDAI(
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    DAI(overrides?: CallOverrides): Promise<BigNumber>;

    WETH9(overrides?: CallOverrides): Promise<BigNumber>;

    feeTier(overrides?: CallOverrides): Promise<BigNumber>;

    swapRouter(overrides?: CallOverrides): Promise<BigNumber>;

    swapWETHForDAI(
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DAI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    WETH9(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeTier(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    swapRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    swapWETHForDAI(
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
