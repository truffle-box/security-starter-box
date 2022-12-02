const chai = require("chai");
const waffle = require("ethereum-waffle");
chai.use(waffle.solidity);
const BN = require("bn.js");
// Enable and inject BN dependency - https://www.chaijs.com/plugins/chai-bn/
chai.use(require("chai-bn")(BN));
const expect = chai.expect;
const {time} = require('@openzeppelin/test-helpers');

contract('[Challenge] The rewarder', (accounts) => {

    let deployer, alice, bob, charlie, david, attacker;
    let users = [];

    const TOKENS_IN_LENDER_POOL = web3.utils.toWei('1000000'); // 1 million tokens

    before(async function () {
        this.timeout(20000);
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, alice, bob, charlie, david, attacker] = accounts;

        // console.log('accounts', {deployer, alice, bob, charlie, david, attacker});
        users = [alice, bob, charlie, david];

        const FlashLoanerPoolFactory = artifacts.require('FlashLoanerPool');
        const TheRewarderPoolFactory = artifacts.require('TheRewarderPool');
        const DamnValuableTokenFactory = artifacts.require('DamnValuableToken');
        const RewardTokenFactory = artifacts.require('RewardToken');
        const AccountingTokenFactory = artifacts.require('AccountingToken');

        this.liquidityToken = await DamnValuableTokenFactory.new({from:deployer});
        this.flashLoanPool = await FlashLoanerPoolFactory.new(this.liquidityToken.address, {from: deployer});

        // Set initial token balance of the pool offering flash loans
        await this.liquidityToken.transfer(this.flashLoanPool.address, TOKENS_IN_LENDER_POOL);

        this.rewarderPool = await TheRewarderPoolFactory.new(this.liquidityToken.address, {from: deployer});
        this.rewardToken = await RewardTokenFactory.at(await this.rewarderPool.rewardToken());
        this.accountingToken = await AccountingTokenFactory.at(await this.rewarderPool.accToken());

        // Alice, Bob, Charlie and David deposit 100 tokens each
        const amount = web3.utils.toWei('100');
        for (let i = 0; i < users.length; i++) {
            await this.liquidityToken.transfer(users[i], amount);
            await this.liquidityToken.approve(this.rewarderPool.address, amount, {from: users[i]});
            await this.rewarderPool.deposit(amount, {from: users[i]});
            expect(
                await this.accountingToken.balanceOf(users[i])
            ).to.be.a.bignumber.eq(amount);
        }
        expect(await this.accountingToken.totalSupply()).to.be.a.bignumber.eq(web3.utils.toWei('400'));
        expect(await this.rewardToken.totalSupply()).to.be.a.bignumber.eq('0');

        // Advance time 5 days so that depositors can get rewards
        await time.increase(time.duration.days(5));
        // await ethers.provider.send("evm_increaseTime", [5 * 24 * 60 * 60]); // 5 days
        
        // Each depositor gets 25 reward tokens
        for (let i = 0; i < users.length; i++) {
            await this.rewarderPool.distributeRewards({from: users[i]});
            expect(
              await this.rewardToken.balanceOf(users[i])
            ).to.be.a.bignumber.eq(web3.utils.toWei("25"));
        }
        expect(await this.rewardToken.totalSupply()).to.be.a.bignumber.eq(web3.utils.toWei('100'));

        // Attacker starts with zero DVT tokens in balance
        expect(await this.liquidityToken.balanceOf(attacker)).to.be.a.bignumber.eq('0');
        
        // Two rounds should have occurred so far
        expect(await this.rewarderPool.roundNumber()).to.be.a.bignumber.eq('2');
    });

    it('Exploit', async function () {
        const RewarderAttackerfactory = artifacts.require('RewarderAttacker');
        const attackerContract = await RewarderAttackerfactory.new(
            this.liquidityToken.address,
            this.flashLoanPool.address,
            this.rewarderPool.address,
            this.rewardToken.address,
            attacker,
            {from: attacker}
        );
        await time.increase(time.duration.days(5));
        // await ethers.provider.send("evm_increaseTime", [5 * 24 * 60 * 60]); // wait 5 days
        await attackerContract.attack(TOKENS_IN_LENDER_POOL, {from: attacker});
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Only one round should have taken place
        expect(
            await this.rewarderPool.roundNumber()
        ).to.be.a.bignumber.eq('3');

        // 10000000000000000
        let limit = new BN('10').pow(new BN(16)); // ethers.utils.parseUnits('1', 16))

        // Users should get neglegible rewards this round
        for (let i = 0; i < users.length; i++) {
            await this.rewarderPool.distributeRewards({from: users[i]});
            let rewards = await this.rewardToken.balanceOf(users[i]);
            // The difference between current and previous rewards balance should be lower than 0.01 tokens
            let delta = rewards.sub(web3.utils.toWei(new BN('25')));
            expect(delta).to.be.a.bignumber.lt(limit); 
        }
        
        // Rewards must have been issued to the attacker account
        expect(await this.rewardToken.totalSupply()).to.be.a.bignumber.gt(web3.utils.toWei('100'));
        let rewards = await this.rewardToken.balanceOf(attacker);

        // The amount of rewards earned should be really close to 100 tokens
        let tokens100 = new BN('10').pow(new BN(17)); // ethers.utils.parseUnits('1', 17))
        let delta = web3.utils.toWei(new BN('100')).sub(rewards);
        expect(delta).to.be.a.bignumber.lt(tokens100);

        // Attacker finishes with zero DVT tokens in balance
        expect(await this.liquidityToken.balanceOf(attacker)).to.be.a.bignumber.eq('0');
    });
});
