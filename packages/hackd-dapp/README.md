# HACKD-DAPP

Our contracts

```
migration:  {
  dappCoinToken: '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab',
  reallyValuableToken: '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24',
  nft: '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'
}

```

## Running

```shell
yarn run-hackdapp
```

This will setup and deploy ganache, do the migrations and start up the react app locally for you to play with.

You can then open the gui and play around with the speedrun.


### How To Play

In this example we have a dapp frontend that will behave 'differently' based on the contents of your EOA on the local blockchain.

1. If you have no ReallyValuableTokens in your account then when you approve to be able to buy the NFT it will send the correct approval to allow the contract to use your `DappCoinToken` balance to buy one.
2. If you do have ReallyValuableTokens in your account then the hackers code will change the approve call to approve them so it can then drain your funds... Fun eh?

#### Scenario 1 - You only have DappCoinTokens

To set up this scenario click the button to get FreeDappTokens, this will mint you 100 tokens so plenty to be able to buy some cool NFTs from here right?

Then you can go buy the NFT by clicking the BUY NFTs button. This will do 2 things:

1. Check it has approval on DappCoinTokens to make the purchase. If not, it will do the approval call first.
2. If it has the approval for your Token spend then it will let you buy an NFT.

#### Scenario 2 - You have DappCoinTokens & ReallyValuableTokensx

To set up this scenario click the button to get FreeDappTokens, this will mint you 100 tokens so plenty to be able to buy some cool NFTs from here right? Then click button to get some ReallyValuableTokens too. You will get 100 of them too. Don't go customising your lambo just yet though...

Then you can go buy the NFT by clicking the BUY NFTs button. This will do 2 things:

1. Check your balance of ReallyValuableTokens... If you have some it will change the approvals and encode that one instead of DappCoinToken.
2. When you approve this, well, game over.
3. Now it has approval, strangely you can't buy any NFTs...
4. At the top of the screen you will see the P0WN3D section changing to show the attacker now has approval on your coins and would most likely drain them.
