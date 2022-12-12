import {ethers} from "ethers"
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {chain, configureChains, createClient, WagmiConfig} from "wagmi"
import {InjectedConnector} from "wagmi/connectors/injected";
import {jsonRpcProvider} from "wagmi/providers/jsonRpc"
import App from "./App";
import "./index.css";
import "./nes.min.css";
import reportWebVitals from "./reportWebVitals";

const RPC_URL = "https://127.0.0.1:8545"
// go for local default
const jsonRpcProviders = new ethers.providers.JsonRpcProvider()

const {chains, provider} = configureChains([chain.localhost],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `http://127.0.0.1:8545`,
      }),
    }),
  ],
)

//const ethProvider = new jsonRpcProvider(process.env.RPC_URL, getNetwork(process.env.CHAIN_ID);
//const connector = new MetaMaskConnector({chains: [chain.hardhat]});

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({chains})],
  provider,
})

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig client={client}>
        <App/>
      </WagmiConfig>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
