const { abi: IUniswapV3PoolABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const { abi: QuoterABI } = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json')
const { Token, CurrencyAmount, TradeType } = require('@uniswap/sdk-core')
const { Pool, Route, Trade } = require('@uniswap/v3-sdk')
const BN = require('bn.js')

const { abi: IUniswapV2Router02ABI}  = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");

const HospoToken = artifacts.require('Hospo')

const DEAD_ADDR = '0x000000000000000000000000000000000000dEaD';
const WETHUSDC_pool_addr = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'
const QuoterContract_addr = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const UniswapV2RouterAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
// we are using a mainnet fork.
const chainId = 1

/**
 * To test:
 *
 * in a console window :
 * yarn ganache-forked
 *
 * then run test:
 *
 * truffle test --show-events ./test/hospowise-pool.test.js
 *
 */
contract('Hospowise - Pool Attack', (accounts) => {

  let deployer, attacker, user

  before(async () => {
    [deployer, attacker, user] = accounts
  })

  it.skip('will connect to an existing pool and get a quote', async () => {

    const poolContract = new web3.eth.Contract(IUniswapV3PoolABI, WETHUSDC_pool_addr)
    const quoterContract = new web3.eth.Contract(QuoterABI, QuoterContract_addr)

    const [immutables, state] = await Promise.all([getPoolImmutables(poolContract), getPoolState(poolContract)])
    const TokenA = new Token(chainId, immutables.token0, 6, 'USDC', 'USD Coin')
    const TokenB = new Token(chainId, immutables.token1, 18, 'WETH', 'Wrapped Ether')

    console.log(`Params: `, { TokenA, TokenB, state, immutables })

    const poolExample = new Pool(
      TokenA,
      TokenB,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick,
    )
    // console.log(`Pool Prices: `, {TokenAPrice: poolExample.priceOf(TokenA).toSignificant(8), TokenBPrice: poolExample.priceOf(TokenB).toSignificant(8)})
    console.log(`Token Prices: `, { TokenA: poolExample.token0Price.toSignificant(8), TokenB: poolExample.token1Price.toSignificant(8) })

    // assign an input amount for the swap
    const amountIn = 1500

    // call the quoter contract to determine the amount out of a swap, given an amount in
    const quotedAmountOut = await quoterContract.methods.quoteExactInputSingle(
      immutables.token0,
      immutables.token1,
      immutables.fee,
      amountIn.toString(),
      0,
    ).call()

    console.log(`Quote: `, { quotedAmountOut })

    // create an instance of the route object in order to construct a trade object
    const swapRoute = new Route([poolExample], TokenA, TokenB)
    // create an unchecked trade instance
    const uncheckedTradeExample = await Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(TokenA, amountIn.toString()),
      outputAmount: CurrencyAmount.fromRawAmount(TokenB, quotedAmountOut.toString()),
      tradeType: TradeType.EXACT_INPUT,
    })

    // print the quote and the unchecked trade instance in the console
    console.log('The quoted amount out is', quotedAmountOut.toString())
    console.log('The unchecked trade object is', uncheckedTradeExample)
  })

  it('will create a pool to test with', async () => {

    // create our artifact
    const token = await HospoToken.deployed()
    await token.startTrading()

    const uniswapPair = await token.uniswapV2Pair()
    console.log(`Addresses: `, { deployer, attacker, user })
    console.log(`Hospo: `, { uniswapPair, address: token.address, owner: await token.owner() })


    // this is a big number...
    const swapAmount = await token.swapTokensAtAmount()
    let amount = new BN(web3.utils.toWei('300', 'mether'))

    // lets add some liquidity to the pool
    await web3.eth.personal.sendTransaction({
      from: deployer,
      to: token.address,
      value: new BN(web3.utils.toWei('100', 'ether')),
    })
    // put some tokens back into the contract itself...
    await token.transfer(token.address, amount, {from: deployer})

    const deployerEth = await web3.eth.getBalance(deployer)
    const contractEth = await web3.eth.getBalance(token.address)
    console.log(`Eth balances: `, { deployer: deployerEth.toString(), hospoContract: contractEth.toString() })


    // given we can burn the tokens for the
    let pairBalance = await token.balanceOf(uniswapPair)
    let contractBalance = await token.balanceOf(token.address)
    let ownerBalance = await token.balanceOf(deployer)
    let attackerBalance = await token.balanceOf(attacker)

    console.log(`Balances: `, {
      ownerBalance: ownerBalance.toString(),
      attackerBalance: attackerBalance.toString(),
      pairBalance: pairBalance.toString(),
      swapAmount: swapAmount.toString(),
      contractBalance: contractBalance.toString(),
      amount: amount.toString(),
    })

    // lets try the pair
    const tokenAmount = new BN(web3.utils.toWei('10', 'ether'))
    const ethAmount = new BN(web3.utils.toWei('1', 'ether'))

    // try and add liquidity
    // const block = await web3.eth.getBlock("pending")
    // const uniRouterV02 = new web3.eth.Contract(IUniswapV2Router02ABI, UniswapV2RouterAddr)
    // await token.approve(UniswapV2RouterAddr, tokenAmount, {from: deployer})
    // await uniRouterV02.methods.addLiquidityETH(deployer, tokenAmount, 0, 0, DEAD_ADDR, block.timestamp).send({
    //   from: deployer,
    //   value: ethAmount
    // })

    // ok this works now!
    await token.testSetup(tokenAmount, ethAmount, { from: deployer })

    // lets transfer some to the attacker
    await token.transfer(attacker, amount, { from: deployer })

    // lets see what changed...
    pairBalance = await token.balanceOf(uniswapPair)
    ownerBalance = await token.balanceOf(deployer)
    attackerBalance = await token.balanceOf(attacker)
    contractBalance = await token.balanceOf(token.address)

    console.log(`Post transfer: `, {
      ownerBalance: ownerBalance.toString(),
      attackerBalance: attackerBalance.toString(),
      pairBalance: pairBalance.toString(),
      contractBalance: contractBalance.toString(),
    })

  })

})

// 1000000
//

async function getPoolImmutables (poolContract) {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
    poolContract.methods.factory().call(),
    poolContract.methods.token0().call(),
    poolContract.methods.token1().call(),
    poolContract.methods.fee().call(),
    poolContract.methods.tickSpacing().call(),
    poolContract.methods.maxLiquidityPerTick().call(),
  ])

  return {
    factory,
    token0,
    token1,
    fee: parseInt(fee),
    tickSpacing: parseInt(tickSpacing),
    maxLiquidityPerTick: new BN(maxLiquidityPerTick),
  }
}

async function getPoolState (poolContract) {
  const [liquidity, slot] = await Promise.all([poolContract.methods.liquidity().call(), poolContract.methods.slot0().call()])
  console.log(`getPoolState: `, { liquidity, slot })
  return {
    liquidity: new BN(liquidity),
    sqrtPriceX96: new BN(slot[0]),
    tick: parseInt(slot[1]),
    observationIndex: parseInt(slot[2]),
    observationCardinality: parseInt(slot[3]),
    observationCardinalityNext: parseInt(slot[4]),
    feeProtocol: parseInt(slot[5]),
    unlocked: slot[6],
  }
}
