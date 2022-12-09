import {HandThumbDownIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import React from "react";
import {useNetwork, useSwitchNetwork} from "wagmi"
import {localhost} from "wagmi/chains"
import {useHackDapp} from "../hooks/useHackDapp";
import WalletButton from "./WalletButton";

const Header = () => {
  const {chain} = useNetwork()
  const {chains, error, isLoading, pendingChainId, switchNetwork} = useSwitchNetwork()
  const {wrongChain} = useHackDapp()

  return (
    <header className="flex col-span-10 nes-container ">
      <div className="flex items-center justify-center gap-4 basis-2/8">
        <div className="animate-spin">
          <i className="nes-icon coin is-medium"></i>
        </div>
        {" "}
        H$CK-DAPP
      </div>
      <div className="flex flex-row items-center justify-end text-xs basis-6/8 w-full gap-6">
        <div className="flex flex-row items-center h-full ">
          {wrongChain && chain &&
            <div className="text-red-500 flex flex-row items-center gap-2">
              <div>Connected to [{chain.name}]</div>
              <HandThumbDownIcon className="h-10 w-12"/>
              <div className="text-white p-4 rounded-xl bg-red-500 text-center justify-center ">WRONG NETWORK,<br/> SWITCH</div>
              {" "}
              <button
                className="nes-btn is-error "
                disabled={!switchNetwork || localhost.id === chain?.id}
                onClick={() => switchNetwork?.(localhost.id)}
              >
                {localhost.name}
                {isLoading && pendingChainId === localhost.id && " (switching)"}
              </button>
            </div>
          }
          {!wrongChain && chain &&
            <div className="text-green-500 flex flex-row items-center gap-2">
              <div>Connected to [{chain.name}]</div>
              <HandThumbUpIcon className="h-10 w-12"/>
            </div>
          }

          {/*{wrongChain &&*/}
          {/*  <>*/}
          {/*    <br/>*/}
          {/*}*/}
          <div>{error && error.message}</div>
        </div>
        <WalletButton/>
      </div>
    </header>
  );
};

export default Header;
