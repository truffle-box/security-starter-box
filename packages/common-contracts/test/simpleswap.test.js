const chai = require("chai")
const BN = require("bn.js");
// // Enable and inject BN dependency - https://www.chaijs.com/plugins/chai-bn/0
chai.use(require("chai-bn")(BN));
const expect = chai.expect;

const SimpleSwapFactory = artifacts.require("SimpleSwap");

const wethAbi = require("../src/abi/WethABI.json")
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18;
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

// const ercAbi = [
//   // Read-Only Functions
//   "function balanceOf(address owner) view returns (uint256)",
//   // Authenticated Functions
//   "function transfer(address to, uint amount) returns (bool)",
//   "function deposit() public payable",
//   "function approve(address spender, uint256 amount) returns (bool)",
// ];

const erc20AbiJson = require("@openzeppelin/contracts/build/contracts/ERC20.json")

contract("SimpleSwap - Test", (accounts) => {
  // our users
  let [deployer, user] = accounts;

  // our contracts
  let WETH, DAI;
  let simpleSwap;

  before(async () => {

    WETH = new web3.eth.Contract(wethAbi, WETH_ADDRESS);
    DAI = new web3.eth.Contract(erc20AbiJson.abi, DAI_ADDRESS);
  });


  beforeEach(async () => {
    simpleSwap = await SimpleSwapFactory.new(SwapRouterAddress, {
      from: deployer,
    });

  })

  it("Should provide a caller with more DAI than they started with after a swap", async () => {
    // given we have all our contracts setup.
    await WETH.methods.deposit().send({
      value: new BN(web3.utils.toWei("10", "ether")),
      from: user,
    });
    /* Check Initial DAI Balance */
    const expandedDAIBalanceBefore = await DAI.methods.balanceOf(user).call();
    const DAIBalanceBefore = new BN(expandedDAIBalanceBefore);
    // console.log(`DAI Balances: `, {DAIBalanceBefore: DAIBalanceBefore.toString(), ss: simpleSwap.methods, ssA: simpleSwap.address})
    /* Approve the swapper contract to spend WETH for me */
    await WETH.methods.approve(simpleSwap.address, web3.utils.toWei("1", "ether")).send({from: user});

    // when I make a swap
    const amountIn = web3.utils.toWei("0.1", "ether")
    const swap = await simpleSwap.swapWETHForDAI(amountIn,{
      gasLimit: 300000,
      from: user
    });
    // console.log(`SWAP: `, {swap})

    // then I should see some DAI in my account.
    /* Check DAI end balance */
    const expandedDAIBalanceAfter = await DAI.methods.balanceOf(user).call();
    const DAIBalanceAfter = new BN(expandedDAIBalanceAfter);
    // console.log(`Vars: `, {DAIBalanceBefore: DAIBalanceBefore.toString(), DAIBalanceAfter: DAIBalanceAfter.toString()})
    expect(DAIBalanceAfter).to.be.a.bignumber.greaterThan(DAIBalanceBefore);
  });
});
