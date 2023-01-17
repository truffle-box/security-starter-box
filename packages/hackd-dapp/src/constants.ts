/**
 * This is the addresses on the local ganache instance for the contracts.
 *
 * If you re-deploy or change the migration these may change...
 */
export const contracts = {
  nft: "0x41bAd2a818F0cC99a1609B9b6040AE3985a1E6b6",
  reallyValuableToken: "0xAF93aB779f224acf0De5cdEa0D5Ae41cAd807Dfa",
  dappCoinToken: '0x4845A85df358b3d5c519f00202e6D141493e0731',
} as const

/*
 migration:  {
   dappCoinToken: '0x4845A85df358b3d5c519f00202e6D141493e0731',
   reallyValuableToken: '0xAF93aB779f224acf0De5cdEa0D5Ae41cAd807Dfa',
   nft: '0x41bAd2a818F0cC99a1609B9b6040AE3985a1E6b6'
 }
 */

export const accounts = {
  deployer: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  attacker: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"
} as const


export const testAccountPrivateKeys = {
  deployer : "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
  attacker : "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
  user1 : "0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c",
} as const
