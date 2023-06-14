import { BaseEVMStateProvider } from '../../../providers/chain-state/evm/api/csp';

export class DUCXStateProvider extends BaseEVMStateProvider {
  constructor() {
    super('DUCX');
  }
}

export const DUCX = new DUCXStateProvider();
