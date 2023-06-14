export const Paths = {
  BTC: {
    mainnet: "m/44'/0'/",
    livenet: "m/44'/0'/"
  },
  BCH: {
    mainnet: "m/44'/145'/",
    livenet: "m/44'/145'/"
  },
  ETH: {
    mainnet: "m/44'/60'/",
    livenet: "m/44'/60'/",
    testnet: "m/44'/60'/",
    regtest: "m/44'/60'/"
  },
  XRP: {
    mainnet: "m/44'/144'/",
    livenet: "m/44'/144'/",
    testnet: "m/44'/144'/",
    regtest: "m/44'/144'/"
  },
  DUCX: {
    mainnet: "m/44'/60'/", // the official ducx derivation path is 966 but users will expect address to be same as ETH
    livenet: "m/44'/60'/",
    testnet: "m/44'/60'/"
  },
  default: {
    testnet: "m/44'/1'/"
  }
};
