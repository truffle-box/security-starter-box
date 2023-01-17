/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  ReallyValuableToken,
  ReallyValuableTokenInterface,
} from "../ReallyValuableToken";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintABunch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052620f42406005553480156200001857600080fd5b506040518060400160405280601381526020017f5265616c6c7956616c7561626c65546f6b656e000000000000000000000000008152506040518060400160405280600381526020017f52565400000000000000000000000000000000000000000000000000000000008152508160039081620000969190620004b6565b508060049081620000a89190620004b6565b505050620000bf33600554620000c560201b60201c565b620006b8565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160362000137576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200012e90620005fe565b60405180910390fd5b6200014b600083836200023260201b60201c565b80600260008282546200015f91906200064f565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200021291906200069b565b60405180910390a36200022e600083836200023760201b60201c565b5050565b505050565b505050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002be57607f821691505b602082108103620002d457620002d362000276565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200033e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002ff565b6200034a8683620002ff565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000397620003916200038b8462000362565b6200036c565b62000362565b9050919050565b6000819050919050565b620003b38362000376565b620003cb620003c2826200039e565b8484546200030c565b825550505050565b600090565b620003e2620003d3565b620003ef818484620003a8565b505050565b5b8181101562000417576200040b600082620003d8565b600181019050620003f5565b5050565b601f82111562000466576200043081620002da565b6200043b84620002ef565b810160208510156200044b578190505b620004636200045a85620002ef565b830182620003f4565b50505b505050565b600082821c905092915050565b60006200048b600019846008026200046b565b1980831691505092915050565b6000620004a6838362000478565b9150826002028217905092915050565b620004c1826200023c565b67ffffffffffffffff811115620004dd57620004dc62000247565b5b620004e98254620002a5565b620004f68282856200041b565b600060209050601f8311600181146200052e576000841562000519578287015190505b62000525858262000498565b86555062000595565b601f1984166200053e86620002da565b60005b82811015620005685784890151825560018201915060208501945060208101905062000541565b8683101562000588578489015162000584601f89168262000478565b8355505b6001600288020188555050505b505050505050565b600082825260208201905092915050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6000620005e6601f836200059d565b9150620005f382620005ae565b602082019050919050565b600060208201905081810360008301526200061981620005d7565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200065c8262000362565b9150620006698362000362565b925082820190508082111562000684576200068362000620565b5b92915050565b620006958162000362565b82525050565b6000602082019050620006b260008301846200068a565b92915050565b61149180620006c86000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80634e244e7e1161008c578063a457c2d711610066578063a457c2d714610228578063a9059cbb14610258578063dd62ed3e14610288578063fc1ed437146102b8576100cf565b80634e244e7e146101be57806370a08231146101da57806395d89b411461020a576100cf565b806306fdde03146100d4578063095ea7b3146100f257806318160ddd1461012257806323b872dd14610140578063313ce56714610170578063395093511461018e575b600080fd5b6100dc6102d6565b6040516100e99190610cd5565b60405180910390f35b61010c60048036038101906101079190610d90565b610368565b6040516101199190610deb565b60405180910390f35b61012a61038b565b6040516101379190610e15565b60405180910390f35b61015a60048036038101906101559190610e30565b610395565b6040516101679190610deb565b60405180910390f35b6101786103c4565b6040516101859190610e9f565b60405180910390f35b6101a860048036038101906101a39190610d90565b6103cd565b6040516101b59190610deb565b60405180910390f35b6101d860048036038101906101d39190610eba565b610404565b005b6101f460048036038101906101ef9190610ee7565b610411565b6040516102019190610e15565b60405180910390f35b610212610459565b60405161021f9190610cd5565b60405180910390f35b610242600480360381019061023d9190610d90565b6104eb565b60405161024f9190610deb565b60405180910390f35b610272600480360381019061026d9190610d90565b610562565b60405161027f9190610deb565b60405180910390f35b6102a2600480360381019061029d9190610f14565b610585565b6040516102af9190610e15565b60405180910390f35b6102c061060c565b6040516102cd9190610e15565b60405180910390f35b6060600380546102e590610f83565b80601f016020809104026020016040519081016040528092919081815260200182805461031190610f83565b801561035e5780601f106103335761010080835404028352916020019161035e565b820191906000526020600020905b81548152906001019060200180831161034157829003601f168201915b5050505050905090565b600080610373610612565b905061038081858561061a565b600191505092915050565b6000600254905090565b6000806103a0610612565b90506103ad8582856107e3565b6103b885858561086f565b60019150509392505050565b60006012905090565b6000806103d8610612565b90506103f98185856103ea8589610585565b6103f49190610fe3565b61061a565b600191505092915050565b61040e3382610ae5565b50565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461046890610f83565b80601f016020809104026020016040519081016040528092919081815260200182805461049490610f83565b80156104e15780601f106104b6576101008083540402835291602001916104e1565b820191906000526020600020905b8154815290600101906020018083116104c457829003601f168201915b5050505050905090565b6000806104f6610612565b905060006105048286610585565b905083811015610549576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161054090611089565b60405180910390fd5b610556828686840361061a565b60019250505092915050565b60008061056d610612565b905061057a81858561086f565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60055481565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610689576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106809061111b565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106f8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ef906111ad565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107d69190610e15565b60405180910390a3505050565b60006107ef8484610585565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610869578181101561085b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161085290611219565b60405180910390fd5b610868848484840361061a565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036108de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d5906112ab565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361094d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109449061133d565b60405180910390fd5b610958838383610c3b565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156109de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109d5906113cf565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610acc9190610e15565b60405180910390a3610adf848484610c40565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610b54576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b4b9061143b565b60405180910390fd5b610b6060008383610c3b565b8060026000828254610b729190610fe3565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610c239190610e15565b60405180910390a3610c3760008383610c40565b5050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610c7f578082015181840152602081019050610c64565b60008484015250505050565b6000601f19601f8301169050919050565b6000610ca782610c45565b610cb18185610c50565b9350610cc1818560208601610c61565b610cca81610c8b565b840191505092915050565b60006020820190508181036000830152610cef8184610c9c565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610d2782610cfc565b9050919050565b610d3781610d1c565b8114610d4257600080fd5b50565b600081359050610d5481610d2e565b92915050565b6000819050919050565b610d6d81610d5a565b8114610d7857600080fd5b50565b600081359050610d8a81610d64565b92915050565b60008060408385031215610da757610da6610cf7565b5b6000610db585828601610d45565b9250506020610dc685828601610d7b565b9150509250929050565b60008115159050919050565b610de581610dd0565b82525050565b6000602082019050610e006000830184610ddc565b92915050565b610e0f81610d5a565b82525050565b6000602082019050610e2a6000830184610e06565b92915050565b600080600060608486031215610e4957610e48610cf7565b5b6000610e5786828701610d45565b9350506020610e6886828701610d45565b9250506040610e7986828701610d7b565b9150509250925092565b600060ff82169050919050565b610e9981610e83565b82525050565b6000602082019050610eb46000830184610e90565b92915050565b600060208284031215610ed057610ecf610cf7565b5b6000610ede84828501610d7b565b91505092915050565b600060208284031215610efd57610efc610cf7565b5b6000610f0b84828501610d45565b91505092915050565b60008060408385031215610f2b57610f2a610cf7565b5b6000610f3985828601610d45565b9250506020610f4a85828601610d45565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610f9b57607f821691505b602082108103610fae57610fad610f54565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610fee82610d5a565b9150610ff983610d5a565b925082820190508082111561101157611010610fb4565b5b92915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000611073602583610c50565b915061107e82611017565b604082019050919050565b600060208201905081810360008301526110a281611066565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000611105602483610c50565b9150611110826110a9565b604082019050919050565b60006020820190508181036000830152611134816110f8565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000611197602283610c50565b91506111a28261113b565b604082019050919050565b600060208201905081810360008301526111c68161118a565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b6000611203601d83610c50565b915061120e826111cd565b602082019050919050565b60006020820190508181036000830152611232816111f6565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b6000611295602583610c50565b91506112a082611239565b604082019050919050565b600060208201905081810360008301526112c481611288565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b6000611327602383610c50565b9150611332826112cb565b604082019050919050565b600060208201905081810360008301526113568161131a565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b60006113b9602683610c50565b91506113c48261135d565b604082019050919050565b600060208201905081810360008301526113e8816113ac565b9050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6000611425601f83610c50565b9150611430826113ef565b602082019050919050565b6000602082019050818103600083015261145481611418565b905091905056fea26469706673582212205615b0863ecc0c7abeca7b1fe05ef2d0c85e2faf357af89616bb3a184ee968c064736f6c63430008110033";

type ReallyValuableTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ReallyValuableTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ReallyValuableToken__factory extends ContractFactory {
  constructor(...args: ReallyValuableTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ReallyValuableToken> {
    return super.deploy(overrides || {}) as Promise<ReallyValuableToken>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ReallyValuableToken {
    return super.attach(address) as ReallyValuableToken;
  }
  override connect(signer: Signer): ReallyValuableToken__factory {
    return super.connect(signer) as ReallyValuableToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ReallyValuableTokenInterface {
    return new utils.Interface(_abi) as ReallyValuableTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ReallyValuableToken {
    return new Contract(address, _abi, signerOrProvider) as ReallyValuableToken;
  }
}
