import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./nes.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  Config,
  Mainnet,
  Goerli,
  Localhost,
  MetamaskConnector,
  DAppProvider,
} from "@usedapp/core";
import { getDefaultProvider } from "@ethersproject/providers";

const readOnlyUrls: Config["readOnlyUrls"] = {
  // [Mainnet.chainId]: process.env.MAINNET_URL || getDefaultProvider("mainnet"),
  // [Goerli.chainId]: process.env.MAINNET_URL
  //   ? process.env.MAINNET_URL.replace("mainnet", "goerli")
  //   : getDefaultProvider("goerli"),
};
if (process.env.LOCALHOST_URL) {
  readOnlyUrls[Localhost.chainId] = process.env.LOCALHOST_URL;
}

const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls,
  multicallVersion: 1 as const,
  fastMulticallEncoding: true,
  noMetamaskDeactivate: true,
  connectors: {
    metamask: new MetamaskConnector(),
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
