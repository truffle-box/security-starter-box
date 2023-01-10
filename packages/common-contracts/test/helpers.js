const BN = require('bn.js')

async function getPoolImmutables (poolContract) {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
    poolContract.methods.factory().call(),
    poolContract.methods.token0().call(),
    poolContract.methods.token1().call(),
    poolContract.methods.fee().call(),
    poolContract.methods.tickSpacing().call(),
    poolContract.methods.maxLiquidityPerTick().call(),
  ])

  return {
    factory,
    token0,
    token1,
    fee: parseInt(fee),
    tickSpacing: parseInt(tickSpacing),
    maxLiquidityPerTick: new BN(maxLiquidityPerTick),
  }
}

async function getPoolState (poolContract) {
  const [liquidity, slot] = await Promise.all([poolContract.methods.liquidity().call(), poolContract.methods.slot0().call()])
  console.log(`getPoolState: `, { liquidity, slot })
  return {
    liquidity: new BN(liquidity),
    sqrtPriceX96: new BN(slot[0]),
    tick: parseInt(slot[1]),
    observationIndex: parseInt(slot[2]),
    observationCardinality: parseInt(slot[3]),
    observationCardinalityNext: parseInt(slot[4]),
    feeProtocol: parseInt(slot[5]),
    unlocked: slot[6],
  }
}

module.exports = {
  getPoolState,
  getPoolImmutables
}
