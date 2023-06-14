import { BaseModule } from '..';
import { EVMVerificationPeer } from '../../providers/chain-state/evm/p2p/EVMVerificationPeer';
import { EVMP2pWorker } from '../../providers/chain-state/evm/p2p/p2p';
import { DUCXStateProvider } from './api/csp';
import { DucxRoutes } from './api/ducx-routes';

export default class DUCXModule extends BaseModule {
  constructor(services: BaseModule['ducatuscoreServices']) {
    super(services);
    services.P2P.register('DUCX', EVMP2pWorker);
    services.CSP.registerService('DUCX', new DUCXStateProvider());
    services.Api.app.use(DucxRoutes);
    services.Verification.register('DUCX', EVMVerificationPeer);
  }
}
