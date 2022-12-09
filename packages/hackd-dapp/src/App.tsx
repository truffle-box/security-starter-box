import Header from "./components/Header";

function App() {
  return (
    <div className="grid grid-cols-10 grid-rows-[auto_minmax(0,1fr)] min-h-screen w-full p-3 gap-1">
      <Header/>
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
