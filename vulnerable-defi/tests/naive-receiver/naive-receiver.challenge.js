const chai = require("chai");
const waffle = require("ethereum-waffle");
chai.use(waffle.solidity);
const BN = require("bn.js");
// Enable and inject BN dependency - https://www.chaijs.com/plugins/chai-bn/
chai.use(require("chai-bn")(BN));
const expect = chai.expect;

contract("[Challenge] Naive receiver", (accounts) => {
  let deployer, user, attacker;

  // Pool has 1000 ETH in balance
  const ETHER_IN_POOL = new BN(web3.utils.toWei("1000", "ether")); // ethers.utils.parseEther('1000');

  // Receiver has 10 ETH in balance
  const ETHER_IN_RECEIVER = new BN(web3.utils.toWei("10", "ether")); //ethers.utils.parseEther('10');

  before(async function () {
    this.timeout(2000);
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, user, attacker] = accounts;

    const LenderPoolFactory = artifacts.require("NaiveReceiverLenderPool");
    const FlashLoanReceiverFactory = artifacts.require("FlashLoanReceiver");

    this.pool = await LenderPoolFactory.new({ from: deployer });
    await this.pool.send(ETHER_IN_POOL, { from: deployer });

    expect(
      await web3.eth.getBalance(this.pool.address)
    ).to.be.a.bignumber.equal(ETHER_IN_POOL);
    expect(await this.pool.fixedFee()).to.be.a.bignumber.equal(
      web3.utils.toWei("1", "ether")
    );

    this.receiver = await FlashLoanReceiverFactory.new(this.pool.address, {
      from: deployer,
    });
    await this.receiver.send(ETHER_IN_RECEIVER, { from: deployer });

    expect(
      await web3.eth.getBalance(this.receiver.address)
    ).to.be.a.bignumber.equal(ETHER_IN_RECEIVER);
  });

  it("Exploit", async function () {
    const attackerContract = await artifacts
      .require("NaiveReceiverAttacker")
      .new(this.pool.address, { from: attacker });
    await attackerContract.attack(this.receiver.address, 10, {
      from: attacker,
    });
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // All ETH has been drained from the receiver
    expect(await web3.eth.getBalance(this.receiver.address)).to.be.equal("0");
    expect(
      await web3.eth.getBalance(this.pool.address)
    ).to.be.a.bignumber.equal(ETHER_IN_POOL.add(ETHER_IN_RECEIVER));
  });
});
