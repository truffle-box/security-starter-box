import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import {
  shortenAddress,
  useEthers,
} from "@usedapp/core";

function WalletButton() {
  const { account, activateBrowserWallet, deactivate, error } = useEthers();
  const [showModal, setShowModal] = useState(false);

  const connectWallet = () => activateBrowserWallet();
  const disconnectWallet = () => {
    deactivate();
    setShowModal(false);
  }
  const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <React.Fragment>
        {!account && (
          <Button className="nes-btn is-warning" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
        {account && (
          <Button className="nes-btn is-success" onClick={toggleModal}>
            Account: {shortenAddress(account)}
          </Button>
        )}
        <Modal show={showModal} onClose={toggleModal}>
          <Modal.Header>Wallet Details</Modal.Header>
          <Modal.Body>
            {account && (
              <div className="space-y-6">
                Account: {shortenAddress(account)}
              </div>
            )}
            {!account && (
              <div className="space-y-6">
                Not connected...
                <Button className="nes-btn is-warning" onClick={connectWallet}>
                  Connect Wallet
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className="nes-btn is-error" onClick={() => disconnectWallet()}>
              Disconnect
            </Button>
            <Button className="nes-btn" onClick={toggleModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    </div>
  );
}

export default WalletButton;
