const Hospo = artifacts.require('Hospo')


const migration: Truffle.Migration = async function (deployer, network, accounts) {

  // const [depAddr] = accounts;

  await deployer.deploy(Hospo)
  const c = await Hospo.deployed();

  console.log(`hospo token: `, {address: c.address, uniswapPair: await c.uniswapV2Pair() })

}

module.exports = migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}
