import { BCHTxProvider } from './bch';
import { BTCTxProvider } from './btc';
import { DUCTxProvider } from './duc';
import { DUCXTxProvider } from './ducx';
import { DUCXERC20TxProvider } from './ducx-erc20';
import { DUCXERC721TxProvider } from './ducx-erc721';
import { ERC20TxProvider } from './erc20';
import { ETHTxProvider } from './eth';
import { ETHMULTISIGTxProvider } from './eth-multisig';
import { XRPTxProvider } from './xrp';

const providers = {
  BTC: new BTCTxProvider(),
  BCH: new BCHTxProvider(),
  ETH: new ETHTxProvider(),
  ETHERC20: new ERC20TxProvider(),
  ETHMULTISIG: new ETHMULTISIGTxProvider(),
  DUC: new DUCTxProvider(),
  DUCX: new DUCXTxProvider(),
  DUCXERC20: new DUCXERC20TxProvider(),
  DUCXERC721: new DUCXERC721TxProvider(),
  XRP: new XRPTxProvider()
};

export class TransactionsProxy {
  get({ chain }) {
    return providers[chain];
  }

  create(params) {
    return this.get(params).create(params);
  }

  sign(params): string {
    return this.get(params).sign(params);
  }

  getSignature(params): string {
    return this.get(params).getSignature(params);
  }

  applySignature(params) {
    return this.get(params).applySignature(params);
  }

  getHash(params) {
    return this.get(params).getHash(params);
  }
}

export default new TransactionsProxy();
