import {Dialog} from "@headlessui/react"
import React, {useState} from "react";
import {useAccount, useConnect, useDisconnect} from "wagmi"
import {InjectedConnector} from "wagmi/connectors/injected"

function WalletButton() {
  const {address, isConnected} = useAccount()
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  })
  const {disconnect} = useDisconnect()

  const [showModal, setShowModal] = useState(false);

  const connectWallet = () => connect();
  const disconnectWallet = () => {
    disconnect();
    setShowModal(false);
  }
  const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <React.Fragment>
        {!isConnected && (
          <button className="nes-btn is-warning" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {isConnected && (
          <button className="nes-btn is-success" onClick={toggleModal}>
            Account: {address}
          </button>
        )}
        <Dialog open={showModal} onClose={toggleModal} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded bg-white">
              <Dialog.Title>Wallet Details</Dialog.Title>
              <div className="space-y-6">
                Account: {address}
              </div>
              )
              {/*{!account && (*/}
              {/*  <div className="space-y-6">*/}
              {/*    Not connected...*/}
              {/*    <button className="nes-btn is-warning" onClick={connectWallet}>*/}
              {/*      Connect Wallet*/}
              {/*    </button>*/}
              {/*  </div>*/}
              {/*)}*/}

              <button className="nes-btn is-error" onClick={() => disconnectWallet()}>
                Disconnect
              </button>
              <button className="nes-btn" onClick={toggleModal}>
                OK
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </React.Fragment>
    </div>
  );
}

export default WalletButton;
