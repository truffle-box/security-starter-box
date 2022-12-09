/**
 * Hooks for the hackdapp code to make our life easier.
 */

import {useEffect, useState} from "react";
import {useNetwork} from "wagmi";
import {localhost} from "wagmi/chains";

/**
 * Hook to handle all our nice statuses in HackDapp
 */
export function useHackDapp() {
  const {chain} = useNetwork()
  const [wrongChain, setWrongChain] = useState(false)

  useEffect(() => {
    if (chain?.id) {
      console.log(`useEffect: `, {wrongChain, chain, localhost, t: chain?.id === localhost.id})
      setWrongChain(chain.id !== localhost.id)
    }
  }, [chain])

  return {wrongChain}
}

export {}
