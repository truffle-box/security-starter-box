# common contracts

This repo contains the common contracts used in this project and we also have some hacks in here you can test/learn from.

We also have all the contracts and typechain code that is used by the hack-dapp code to run tests in the UI.

## Hacks

* Hospo
* HackDapper-BadgerDao

### Hospo - Bad Access Control
The hospo token is a real life hack. There is a test file that shows you what happened to the contract and goes into 
some detail on the hack but lets break it down.

#### 1 - The Contract

The smart contract has one fatal flaw, someone had forgot to add proper access controls on a pretty important method
`burn`. 

`contracts/BadAccessControl/Hospo.sol`

```solidity

   function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

```

Usually you will use something like the OpenZeppelin [`Ownable` [link]](https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable).

Then you could do something really simple like:

```solidity

   function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }

```

And this would have stopped the problem altogether.

#### 2 - Running The Hack

In the test folder we have a file: `test/hospowise-pool.test.js` that sets up and 
runs the hack.

Running the hack:

In one terminal window at the root of this package `packages/common-contracts` run:

```shell
~/dev/security-starter-box/packages/common-contracts
> yarn ganache-forked
```

This will set up a forked mainnet ganache instance we can run against. The reason we do this is it allows us to fork at a specific block and set up a few other flags. It also helps to
see what's going on in terms of transactions mined etc.

The in another shell we can run the test:

```shell
~/dev/security-starter-box/packages/common-contracts
> truffle test ./test/hospowise-pool.test.js
```

This will run the test and give you some output on the console.

The important output will be the last block:

```shell
Attacker: Post Attack:  {
  eth: '9999997958316047555238',
  weth: '9.989979959919839679',
  hospo: '0',
  profit: '9.989979959919839679'
}
```

So this output here shows the attackers balances/profit post hack in terms of WETH they
drained from the uniswap pool that was unfortunately the liquidity pool for this token.

#### 3 - Explaining The Hack

Ok, so what actually happens?

The hack in itself is probably innocuous if you had released a token with this access control broken in it. Someone might come along and burn some tokens as an act of vandalism.

The bigger issue is when the tokens actually have some value attached to them.

The Hospo team had aimed to use the token as a liquidity token for their project and as a result had created a Uniswap V2 pool backed by ETH. The hacker saw this and then used the broken access control on the `burn` method to their own gain(z).

So lets go through how we re-enact in our test this:

**Deploy the contract:**

We have a copy of the token taken from Etherscan and have got it compiling in our project. We have modified a few things. We removed the `_transfer` method as it had a lot of complexity relating to the LP side of things that were not pertinent to the hack. We have left it in with another name if your really interested in looking at it.

We added one more method `testSetup` more as a convenience to allow us to prime the uniswap pool with some liquidity from the contract in a way similar to the contract would have done.

The file `migration-ts/3_deploy_hospo.ts` is the actual migration script but it's super simple.

**Setup our environment:**

This all happens in the `before` element.

In this stage we rely on some contracts in our fork, namely the `UniswapV2Router` so we use web3 and the `@uniswap/v2=periphery` package to get the ABI so we can connect and call some methods on it. We do the same for the WETH contract as we need that in the test later on to check balances.

Once we start trading on the contract and grab the pair address we save a few other elements like the pair contract and each token as we use them later on in the trade.

**Setup our hack:**

In the actual test `it('will hack hospo token UniswapPair', async () => {...` we send some eth to the contract and save a few constant for the hack going forward.

We then also send some tokens to the contract. This creates the amounts we will prime the liquidity pool with. We prime the pool by calling:

` await token.testSetup(tokenAmount, ethAmount, { from: deployer })`

This sets up the pool with the following values:

```shell
PREHACK HOSPO BALANCES:  {
  ownerBalance: '21999999998001000000000000000000',
  attackerBalance: '1000000000000000000000',
  pairBalance: '1000000000000000000000',
  uniswapRouterBalance: '0'
}
uniswap pair balances:  {
  hospo: '1000000000000000000000',
  hReserve: '1000',
  weth: '10000000000000000000',
  wReserve: '10'
}

```

So we have 1000:10 hospo:weth going on. So 100:1 ratio. We use these numbers to make life easier. The `pairBalance` at the top shows you how much Hospo the uniswap pair is holding. `hReserve` and `wReserve` as the hospo/weth reserves in the pool as a ratio (1000:10).

**The Hack:**

The hack itself is now relatively simple. We burn the tokens that the uniswap pair has access to and then tell that pair to `sync` which is akin to refreshing the balances. The balances are state inside the pair so until you do this the pair doesn't really know things have changed externally.

We approve all our tokens to be used by it in the sale:
`await token.approve(UniswapV2RouterAddr, attackerAmount, { from: attacker })`

We then make a trade up and send this to Uniswap Router:

`await uniswapRouterV2.methods.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline).send({ from: attacker, gas: gasUsed })`

And at this point, if the trade goes through, we see the new balances:

```shell
POST TRADE HOSPO BALANCES:  {
  ownerBalance: '21999999998001000000000000000000',
  attackerBalance: '0',
  pairBalance: '1001000000000000000000',
  uniswapRouterBalance: '0'
}
uniswap pair balances:  {
  hospo: '1001000000000000000000',
  hReserve: '1001',
  weth: '10020040080160321',
  wReserve: '0.01002'
}
Attacker: Post Attack:  {
  eth: '9999998741024980500213',
  weth: '9.989979959919839679',
  hospo: '0',
  profit: '9.989979959919839679'
}
```

This tells us the following:

* The attacker has sold all their hospo tokens.
* The uniswap pair has now got a tiny amount of weth left `0.01002` in reserve.
* The attacker has made `9.989979959919839679 WETH` profit which is almost all the WETH in the pool from selling his tokens.

## Conclusion

This hack took a while to put together as learning about the uniswap pairs and APIs was quite new to me. But once you understood how we could tip the balance of the pool to your advantage this hack really shows you the multidimensional chess game your playing if you don't get your base contracts right and then rely on them in a more complex scenario.

The Hospo contract is only slightly modified to make the test work easier but please remember if do have a bunch of methods like this that are fundamental to your Tokens lifecycle/governance etc. please test them thorougly and add in edge case tests like attempting all these methods as non-authorised addresses and ensure they revert properly.

### HackDapp - BadgerDAO Hack
The second hack is done in side the `hackd-dapp` package but we have the contracts here for that code which are simple ERC20 and ERC721 contracts. The ERC721 allows you to mint the NFT with an ERC20 and is actually part of the reason the hack worked so well as you think you are approving the ERC20 for purchase of the NFT/ERC721 but if your unlucky enough you actually end up approving the wrong thing and the hacker wins... 
