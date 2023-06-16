import { BaseEVMStateProvider } from '../../../providers/chain-state/evm/api/csp';

const minGasPrices = {
  mainnet: Number(process.env.DUCX_MIN_GAS_PRICE_MAINNET), 
  testnet: Number(process.env.DUCX_MIN_GAS_PRICE_TESTNET)
};

export class DUCXStateProvider extends BaseEVMStateProvider {
  constructor() {
    super('DUCX', minGasPrices);
  }
}

export const DUCX = new DUCXStateProvider();
