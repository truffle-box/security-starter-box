import {useHackDapp} from "./hooks/useHackDapp";

export const Welcome = function() {
  const {wrongChain} = useHackDapp()

  return <>
    <div className="flex flex-row w-4/5 pt-10 ">
      {/* show this if we are not on the correct network */}
      {wrongChain && <>
        <i className="md:mt-32 mt-52 nes-kirby"></i>
        <div className="m-auto align-top nes-balloon from-left h-fit ">
          <p>MAKE SURE YOU ARE RUNNING THIS ON GANACHE LOCALLY.</p>
        </div>
      </>}
      {!wrongChain && <>
        <i className="md:mt-32 mt-52 nes-squirtle"></i>
        <div className="m-auto align-top nes-balloon from-left h-fit ">
          <p>LETS GO HACK!</p>
        </div>
      </>}
    </div>
    <br/>
    Lets get to work...
  </>;
};
