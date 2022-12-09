export const Welcome = function() {
  return <>
    <div className="flex flex-row w-4/5 pt-10 ">
      <i className="md:mt-32 mt-52 nes-kirby"></i>
      {/* show this if we are not on the correct network */}
      <div className="m-auto align-top nes-balloon from-left h-fit ">
        <p>MAKE SURE YOU ARE RUNNING THIS ON GANACHE LOCALLY.</p>
      </div>
    </div>
    <br/>
    Lets get to work...
  </>;
};
