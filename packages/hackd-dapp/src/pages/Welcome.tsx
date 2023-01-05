import {useHackDapp} from "../hooks/useHackDapp";

export const Welcome = function() {
  const {wrongChain} = useHackDapp()

  return <>
    <div className="flex flex-col w-4/5 items-center justify-center align-middle h-full ">
      {/* show this if we are not on the correct network */}
      {wrongChain && <>
        <div><i className="md:mt-32 mt-52 nes-kirby"></i>
          <div className="m-auto align-top nes-balloon from-left h-fit ">
            <p>MAKE SURE YOU ARE RUNNING THIS ON GANACHE LOCALLY.</p>
          </div>
        </div>
      </>}
      {!wrongChain && <>
        <div><i className="md:mt-32 mt-52 nes-squirtle"></i>
          <div className="m-auto align-top nes-balloon from-left h-fit ">
            <p>LETS GO HACK!</p>
          </div>
        </div>
      </>}
      <div className="pt-4">
        <h2>Lets get to work...</h2>
        <br/>
        Notes:
        <hr/>
        <ul className="list-disc">
          <li>If you have any issues on restarting the ganache server to try again. You may need to reset your metamask wallet as the nonce may be out of sync. <a href="https://metamask.zendesk.com/hc/en-us/articles/360015488891-How-to-reset-an-account" target="_blank">[link]</a> </li>
        </ul>
      </div>
    </div>
  </>;
};
