/**
 * This is the addresses on the local ganache instance for the contracts.
 *
 * If you re-deploy or change the migration these may change...
 */
export const contracts = {
  nft: "0xCfEB869F69431e42cdB54A4F4f105C19C080A601",
  reallyValuableToken: "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
  dappCoinToken: '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab',
} as const

/*
 [migrate]   dappCoinToken: '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab',
 [migrate]   reallyValuableToken: '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24',
 [migrate]   nft: '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'
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
