const DappCoinToken = artifacts.require('DappCoinToken')
const ReallyValuableToken = artifacts.require('ReallyValuableToken')
const HackDapperNFT = artifacts.require('HackDapper')

const migration: Truffle.Migration = async function (deployer, network, accounts) {

  const [depAddr] = accounts;

  await deployer.deploy(DappCoinToken)
  const dcToken = await DappCoinToken.deployed()

  await deployer.deploy(ReallyValuableToken)
  const rvToken = await ReallyValuableToken.deployed()


  await deployer.deploy(HackDapperNFT, DappCoinToken.address, {from: depAddr})
  const hdNFT = await HackDapperNFT.deployed();
  console.log(`migration: `, {dappCoinToken: dcToken.address, reallyValuableToken: rvToken.address, nft: hdNFT.address})
}

module.exports = migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}
