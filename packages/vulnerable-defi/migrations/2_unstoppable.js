const UnstoppableLender = artifacts.require("UnstoppableLender");
const DamnValuableToken = artifacts.require("DamnValuableToken");
const ReceiverContract = artifacts.require("ReceiverUnstoppable");

const TOKENS_IN_POOL = web3.utils.toWei("1000000", "ether");
const INITIAL_ATTACKER_TOKEN_BALANCE = web3.utils.toWei("100", "ether");

module.exports = async function (deployer, network, accounts) {
  // Token deployments
  const [depAddr, attacker, someUser] = accounts;
  
  await deployer.deploy(DamnValuableToken);
  const token = await DamnValuableToken.deployed();
  // console.log('objects', {attacker, someUser, depAddr, token});

  await deployer.deploy(UnstoppableLender, DamnValuableToken.address);
  const pool = await UnstoppableLender.deployed();

  // setup tokens
  await token.approve(pool.address, TOKENS_IN_POOL);
  await pool.depositTokens(TOKENS_IN_POOL, { from: depAddr });
  await token.transfer(attacker, INITIAL_ATTACKER_TOKEN_BALANCE, {from: depAddr})
  
  // flash loan can be executed.
  await deployer.deploy(ReceiverContract, pool.address, {from: someUser});
  const receiver =  await ReceiverContract.deployed();
  await receiver.executeFlashLoan(10, {from: someUser});

console.log('deployedContracts:', {receiver: receiver.address, token: token.address, pool: pool.address})

};
