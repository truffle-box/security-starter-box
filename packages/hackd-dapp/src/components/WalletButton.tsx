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
            <Dialog.Panel className="nes-container with-title  w-8/12 p-4 rounded bg-white  border-2 border-red-500">
              <div className="title ">Wallet Details</div>
              <div className="space-y-6 text-lg ">
                Account: {address}
              </div>
              <br/>

              <button className="nes-btn is-error" onClick={() => disconnectWallet()}>
                Disconnect
              </button>
              {' '}
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
