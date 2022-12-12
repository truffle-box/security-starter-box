import {Link, Outlet, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import {Leaderboard} from "./components/Leaderboard";
import Mint from "./pages/Mint";
import {Welcome} from "./pages/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Welcome/>}/>
        <Route path="coinz" element={<Mint/>}/>
        {/*/!* Using path="*"" means "match anything", so this route*/}
        {/* acts like a catch-all for URLs that we don't have explicit*/}
        {/* routes for. *!/*/}
        <Route path="*" element={<NoMatch/>}/>
      </Route>
    </Routes>
  )
}

function Layout() {
  return (
    <div className="grid grid-cols-10 grid-rows-[auto_minmax(0,1fr)] min-h-screen w-full gap-1">
      <Header/>
      <nav className="col-span-2 nes-container is-rounded ">
        <h3>L1NKZ</h3>
        <hr className="h-2"/>
        <ul className="list-disc">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/coinz">3 C01NZ</Link></li>
          <li><Link to="/mint">M1NT NFT</Link></li>
        </ul>
      </nav>
      <main className="flex flex-col items-center justify-start col-span-8 nes-container is-rounded">
        <Leaderboard/>
        <Outlet/>
      </main>
      <footer className="nes-container is-dark col-span-10 text-[8px] ">
        Made by the Elves at Truffle...
      </footer>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
