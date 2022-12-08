const DappCoinToken = artifacts.require('DappCoinToken')
const ReallyValuableToken = artifacts.require('ReallyValuableToken')
const HackDapperNFT = artifacts.require('HackDapper')

const migration: Truffle.Migration = async function (deployer) {
  const dct = await deployer.deploy(DappCoinToken)
  console.log(`migration: `, {dct})

}

module.exports = migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}
