const chai = require("chai");
const waffle = require("ethereum-waffle");
chai.use(waffle.solidity);
const BN = require("bn.js");
// Enable and inject BN dependency - https://www.chaijs.com/plugins/chai-bn/
chai.use(require("chai-bn")(BN));
const expect = chai.expect;


contract('[Challenge] Truster', (accounts) => {
    let deployer, attacker;

    const TOKENS_IN_POOL = web3.utils.toWei("1000000", "ether");

    before(async function () {
        this.timeout(20000);
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = accounts;

        const DamnValuableToken = artifacts.require('DamnValuableToken');
        const TrusterLenderPool = artifacts.require('TrusterLenderPool');

        this.token = await DamnValuableToken.new({from: deployer});
        this.pool = await TrusterLenderPool.new(this.token.address, {from: deployer});

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL, {from: deployer});

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.a.bignumber.equal(TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(attacker)
        ).to.be.a.bignumber.equal('0');
    });

    it('Exploit', async function () {
        const AttackerContractFactory = artifacts.require('TrusterAttacker');
        const attackerContract = await AttackerContractFactory.new(this.token.address, this.pool.address, {from: attacker});
        // single TX - bOOM CHAKALAKA!
        await attackerContract.attack({from: attacker});
        // const balance = await this.token.balanceOf(attacker);
        // const allowance = await this.token.allowance(this.pool.address, attacker);
        // console.log("Balance: ", {allowance: allowance.toString(), balance: balance.toString()});
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        expect(
            await this.token.balanceOf(attacker)
        ).to.be.a.bignumber.equal(TOKENS_IN_POOL);
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.a.bignumber.equal('0');
    });
});

