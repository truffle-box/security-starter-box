import React from "react";
import {useHackDapp, useHackerMonitor} from "../hooks/useHackDapp";
import {classNames} from "../utils";

export const Leaderboard = () => {
  const {wrongChain, myEthBalance, myDTBalance, myRvtBalance} = useHackDapp()
  const {attackerEthBalance, attackerRvtBalance} = useHackerMonitor()

  const {hacked} = useHackerMonitor()

  if (wrongChain) {
    return <>
      <div className="w-full nes-container is-dark with-title is-rounded">
        <p className="title">Leaderboard</p>
        <div>
          CONNECT TO LOCALHOST SERVER TO START
        </div>
      </div>

    </>
  } else {
    // ok lets go
    return (
      <div className={classNames(
        hacked ? "bg-orange-600" : "is-dark",
        "w-full nes-container with-title is-rounded",
      )
      }>
        <p className="title">Leaderboard</p>
        <div className="flex w-full">
          <div className="nes-table-responsive text-[12px]">
            <table className={classNames("nes-table is-bordered is-dark justify-center is-centered ")}>
              <thead>
              <tr>
                <th>Address</th>
                <th>ETH</th>
                <th>Really Valuable <br/> Tokens</th>
                <th>Dapp Tokens</th>
                <th>NFTS</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>YOU</td>
                <td>{myEthBalance?.formatted} {myEthBalance?.symbol}</td>
                <td>{myRvtBalance?.formatted} {myRvtBalance?.symbol}</td>
                <td>{myDTBalance?.formatted} {myDTBalance?.symbol}</td>
                <td>TBC</td>
              </tr>
              <tr>
                <td>Attacker</td>
                <td>{attackerEthBalance?.formatted} {attackerEthBalance?.symbol}</td>
                <td>{attackerRvtBalance?.formatted} {attackerRvtBalance?.symbol}</td>
                <td>-</td>
                <td>-</td>
              </tr>
              </tbody>
            </table>
          </div>
          {hacked && <div className="flex m-auto text-7xl">
            <h1>GAME OVER</h1>
          </div>
          }
        </div>
      </div>
    );

  }
};
