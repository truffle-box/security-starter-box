import WalletButton from "./components/WalletButton";

function App() {
  return (
    <div className="grid grid-cols-10 grid-rows-[auto_minmax(0,1fr)] min-h-screen w-full p-3 gap-1">
      <header className="flex col-span-10 nes-container ">
        <div className="flex items-center justify-center gap-4 basis-2/6">
          <div className="animate-spin">
            <i className="nes-icon coin is-medium"></i>
          </div>{" "}
          H$CK-DAPP
        </div>
        <div className="flex justify-end m-auto text-xs basis-4/6 ">
          <WalletButton />
        </div>
      </header>
      <nav className="col-span-2 nes-container ">Some links here</nav>
      <main className="flex flex-col items-center justify-center col-span-8 nes-container ">
        <div className="flex flex-row w-4/5 ">
          <i className="md:mt-32 mt-52 nes-kirby"></i>
          <div className="m-auto align-top nes-balloon from-left h-fit ">
            <p>MAKE SURE YOU ARE RUNNING THIS ON GANACHE LOCALLY.</p>
          </div>
        </div>
        <br />
        main things in here...
      </main>
      <footer className="nes-container is-dark col-span-10 text-[8px] ">
        Made by the Elves at Truffle...
      </footer>
    </div>
  );
}

export default App;
