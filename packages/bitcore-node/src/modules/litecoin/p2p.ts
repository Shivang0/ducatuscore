import { EventEmitter } from 'events';
import { BitcoinBlock, BitcoinBlockStorage } from '../../models/block';
import { Libs } from '../../providers/libs';
import { BitcoinP2PWorker } from '../bitcoin/p2p';

export class LitecoinP2PWorker extends BitcoinP2PWorker {
  protected ducatuscoreLib: any;
  protected ducatuscoreP2p: any;
  protected chainConfig: any;
  protected messages: any;
  protected connectInterval?: NodeJS.Timer;
  protected invCache: any;
  protected invCacheLimits: any;
  protected initialSyncComplete: boolean;
  protected blockModel: BitcoinBlock;
  protected pool: any;
  public events: EventEmitter;
  public isSyncing: boolean;
  constructor({ chain, network, chainConfig, blockModel = BitcoinBlockStorage }) {
    super({ chain, network, chainConfig, blockModel });
    this.blockModel = blockModel;
    this.chain = chain;
    this.network = network;
    this.ducatuscoreLib = Libs.get(this.chain).lib;
    this.ducatuscoreP2p = Libs.get(this.chain).p2p;
    this.chainConfig = chainConfig;
    this.events = new EventEmitter();
    this.isSyncing = false;
    this.initialSyncComplete = false;
    this.invCache = {};
    this.invCacheLimits = {
      [this.ducatuscoreP2p.Inventory.TYPE.BLOCK]: 100,
      [this.ducatuscoreP2p.Inventory.TYPE.TX]: 100000
    };

    if (this.network === 'regtest') {
      this.ducatuscoreLib.Networks.enableRegtest();
    }

    this.messages = new this.ducatuscoreP2p.Messages({
      // As of Litcoin Core v0.18.1, min protocolVersion is 70002
      // As of ducatuscore v8.x, max protocolVersion is 70011 before seeing connection errors
      protocolVersion: 70011,
      network: this.ducatuscoreLib.Networks.get(this.network),
      Block: this.ducatuscoreLib.Block,
      Transaction: this.ducatuscoreLib.Transaction,
      BlockHeader: this.ducatuscoreLib.BlockHeader
    });

    this.pool = new this.ducatuscoreP2p.Pool({
      addrs: this.chainConfig.trustedPeers.map(peer => {
        return {
          ip: {
            v4: peer.host
          },
          port: peer.port
        };
      }),
      dnsSeed: false,
      listenAddr: false,
      network: this.network,
      messages: this.messages
    });
  }
}
