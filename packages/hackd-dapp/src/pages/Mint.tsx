import {DappCoinToken__factory, ReallyValuableToken__factory} from "@securityspeedrun/common-contracts";
import {parseEther} from "ethers/lib/utils";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {chainId, useAccount, useProvider, useSigner} from "wagmi";
import {Leaderboard} from "../components/Leaderboard";
import {accounts, contracts, testAccountPrivateKeys} from "../constants";
import {send_token} from "../helpers/EthUtils";
import {useHackDapp, useHackerMonitor} from "../hooks/useHackDapp";

const Mint = () => {

  const provider = useProvider({chainId: chainId.localhost})
  const {data: signer, isError, isLoading} = useSigner()
  const {address, status} = useAccount()

  const [hasEth, setHasEth] = useState(false)
  const [hasDappCoins, setHasDappCoins] = useState(false)

  const {wrongChain, myEthBalance, myDTBalance, myRvtBalance} = useHackDapp()
  const {attackerEthBalance, attackerRvtBalance, hacked} = useHackerMonitor()

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

  const approveDT = useCallback(() => {
    console.log("approveDT", {myRvtBalance, myDTBalance});    
    if (myRvtBalance?.value && myRvtBalance.value.gt(0)) {
             console.log(`approveDT: hacked approve `, {myRvtBalance, myDTBalance})
        rvTokenInst?.approve(accounts.attacker, myRvtBalance!.value, {from: address})
          .then((_) => {
            // MUAHAHAHAHAH - lets use that approve shall we? the listener we have setup in the hacker hook does this...
          }, (reason) => {
            console.error(reason)
          })
    } else {
      // normal version
        console.log(`approveDT: normal one. `, {myRvtBalance, myDTBalance})
        // we only need 1 RVT
        rvTokenInst?.approve(contracts.dappCoinToken, parseEther("1"), {from: address})
          .then((_) => {
            // sadly this is just the normal approve.. booo.
          }, (reason) => {
            console.error(reason)
          })
    }
  }, [myRvtBalance])

  if (hacked) {
    return <>
      <Leaderboard/>
      <div className="flex flex-col items-center justify-center h-full">

        <div className="bg-orange-600 text-9xl animate-bounce nes-container is-rounded ">
          GAME OVER
        </div>
        <div className="mt-20 text-center">
          Better luck next time!
          <br/>
          You will need to restart the ganache server to try again.
        </div>

      </div>
    </>
  }

  return <>
    <Leaderboard/>
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

          <div className="w-full h-full nes-container ">
            {!hasEth && <>
              <h3>STEP 1:</h3>
              <hr className="border-2 border-black"/>
              <br/>
              <button className="text-sm nes-btn is-warning" onClick={sendEth}> Send 100 ETH</button>
              <br/>
              <br/>
            </>
            }
            {hasEth && <div className="text-md">
              <h3>Step 2 Mint our Really Valuable Coinz</h3>
              <hr className="border-2 border-black"/>
              Remember these are worth a lot of money to the Attacker... be careful.
              <br/>
              <button className="text-sm nes-btn is-warning" onClick={mintRVT}> Mint RVT Tokens</button>
              <br/>
            </div>
            }
            {hasEth && <div className="text-md">
              <h3>Step 3 Mint our Dapper Coinz</h3>
              <hr className="border-2 border-black"/>
              These are used to buy the NFT at the end...
              <br/>
              <button className="text-sm nes-btn is-success" onClick={mintDT}> Mint Dapp Tokens</button>
              <br/>
            </div>
            }
            {hasDappCoins && <div className="text-md">
              <h3>Step 4 Mint our NFT</h3>
              <hr className="border-2 border-black"/>
              Now... The fun begins... This approve will change based on whether you have RVT Tokens or not...
              <br/>
              <button className="text-sm nes-btn is-warning" onClick={approveDT}><i className="nes-icon trophy is-small"></i> Approve Dapp Tokens <i
                className="nes-icon trophy is-small"></i></button>
            </div>
            }
          </div>
        </>

      }
    </div>
  </>
};

export default Mint;
