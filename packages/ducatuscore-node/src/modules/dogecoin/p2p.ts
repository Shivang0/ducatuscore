import { EventEmitter } from 'events';
import logger, { timestamp } from '../../logger';
import { BitcoinBlock, BitcoinBlockStorage, IBtcBlock } from '../../models/block';
import { StateStorage } from '../../models/state';
import { TransactionStorage } from '../../models/transaction';
import { ChainStateProvider } from '../../providers/chain-state';
import { Libs } from '../../providers/libs';
import { BaseP2PWorker } from '../../services/p2p';
import { SpentHeightIndicators } from '../../types/Coin';
import { BitcoinBlockType, BitcoinHeaderObj, BitcoinTransaction } from '../../types/namespaces/Bitcoin';
import { wait } from '../../utils/wait';

export class DogecoinP2PWorker extends BaseP2PWorker<IBtcBlock> {
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
      protocolVersion: 70003,
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

  cacheInv(type: number, hash: string): void {
    if (!this.invCache[type]) {
      this.invCache[type] = [];
    }
    if (this.invCache[type].length > this.invCacheLimits[type]) {
      this.invCache[type].shift();
    }
    this.invCache[type].push(hash);
  }

  isCachedInv(type: number, hash: string): boolean {
    if (!this.invCache[type]) {
      this.invCache[type] = [];
    }
    return this.invCache[type].includes(hash);
  }

  setupListeners() {
    this.pool.on('peerready', peer => {
      logger.info(
        `${timestamp()} | Connected to peer: ${peer.host}:${peer.port.toString().padEnd(5)} | Chain: ${
          this.chain
        } | Network: ${this.network}`
      );
    });

    this.pool.on('peerconnect', peer => {
      logger.info(
        `${timestamp()} | Connected to peer: ${peer.host}:${peer.port.toString().padEnd(5)} | Chain: ${
          this.chain
        } | Network: ${this.network}`
      );
    });

    this.pool.on('peerdisconnect', peer => {
      logger.warn(
        `${timestamp()} | Not connected to peer: ${peer.host}:${peer.port.toString().padEnd(5)} | Chain: ${
          this.chain
        } | Network: ${this.network}`
      );
    });

    this.pool.on('peertx', async (peer, message) => {
      const hash = message.transaction.hash;
      logger.debug('peer tx received: %o', {
        peer: `${peer.host}:${peer.port}`,
        chain: this.chain,
        network: this.network,
        hash
      });
      if (this.isSyncingNode && !this.isCachedInv(this.ducatuscoreP2p.Inventory.TYPE.TX, hash)) {
        this.cacheInv(this.ducatuscoreP2p.Inventory.TYPE.TX, hash);
        await this.processTransaction(message.transaction);
        this.events.emit('transaction', message.transaction);
      }
    });

    this.pool.on('peerblock', async (peer, message) => {
      const { block } = message;
      const { hash } = block;
      logger.debug('peer block received: %o', {
        peer: `${peer.host}:${peer.port}`,
        chain: this.chain,
        network: this.network,
        hash
      });

      const blockInCache = this.isCachedInv(this.ducatuscoreP2p.Inventory.TYPE.BLOCK, hash);
      if (!blockInCache) {
        block.transactions.forEach(transaction => this.cacheInv(this.ducatuscoreP2p.Inventory.TYPE.TX, transaction.hash));
        this.cacheInv(this.ducatuscoreP2p.Inventory.TYPE.BLOCK, hash);
      }
      if (this.isSyncingNode && (!blockInCache || this.isSyncing)) {
        this.events.emit(hash, message.block);
        this.events.emit('block', message.block);
        if (!this.isSyncing) {
          this.sync();
        }
      }
    });

    this.pool.on('peerheaders', (peer, message) => {
      logger.debug('peerheaders message received: %o', {
        peer: `${peer.host}:${peer.port}`,
        chain: this.chain,
        network: this.network,
        count: message.headers.length
      });
      this.events.emit('headers', message.headers);
    });

    this.pool.on('peerinv', (peer, message) => {
      if (this.isSyncingNode) {
        const filtered = message.inventory.filter(inv => {
          const hash = this.ducatuscoreLib.encoding
            .BufferReader(inv.hash)
            .readReverse()
            .toString('hex');
          return !this.isCachedInv(inv.type, hash);
        });

        if (filtered.length) {
          peer.sendMessage(this.messages.GetData(filtered));
        }
      }
    });
  }

  async connect() {
    this.setupListeners();
    this.pool.connect();
    this.connectInterval = setInterval(this.pool.connect.bind(this.pool), 5000);
    return new Promise<void>(resolve => {
      this.pool.once('peerready', () => resolve());
    });
  }

  async disconnect() {
    this.pool.removeAllListeners();
    this.pool.disconnect();
    if (this.connectInterval) {
      clearInterval(this.connectInterval);
    }
  }

  public async getHeaders(candidateHashes: string[]): Promise<BitcoinHeaderObj[]> {
    let received = false;
    return new Promise<BitcoinHeaderObj[]>(async resolve => {
      this.events.once('headers', headers => {
        received = true;
        resolve(headers);
      });
      while (!received) {
        this.pool.sendMessage(this.messages.GetHeaders({ starts: candidateHashes }));
        await wait(1000);
      }
    });
  }

  public async getBlock(hash: string) {
    logger.debug('Getting block, hash: %o', hash);
    let received = false;
    return new Promise<BitcoinBlockType>(async resolve => {
      this.events.once(hash, (block: BitcoinBlockType) => {
        logger.debug('Received block, hash: %o', hash);
        received = true;
        resolve(block);
      });
      while (!received) {
        this.pool.sendMessage(this.messages.GetData.forBlock(hash));
        await wait(1000);
      }
    });
  }

  getBestPoolHeight(): number {
    let best = 0;
    for (const peer of Object.values(this.pool._connectedPeers) as { bestHeight: number }[]) {
      if (peer.bestHeight > best) {
        best = peer.bestHeight;
      }
    }
    return best;
  }

  async processBlock(block: BitcoinBlockType): Promise<any> {
    await this.blockModel.addBlock({
      chain: this.chain,
      network: this.network,
      forkHeight: this.chainConfig.forkHeight,
      parentChain: this.chainConfig.parentChain,
      initialSyncComplete: this.initialSyncComplete,
      block
    });
  }

  async processTransaction(tx: BitcoinTransaction): Promise<any> {
    const now = new Date();
    await TransactionStorage.batchImport({
      chain: this.chain,
      network: this.network,
      txs: [tx],
      height: SpentHeightIndicators.pending,
      mempoolTime: now,
      blockTime: now,
      blockTimeNormalized: now,
      initialSyncComplete: true
    });
  }

  async syncDone() {
    return new Promise(resolve => this.events.once('SYNCDONE', resolve));
  }

  async sync() {
    if (this.isSyncing) {
      return false;
    }
    this.isSyncing = true;
    const { chain, chainConfig, network } = this;
    const { parentChain, forkHeight } = chainConfig;
    const state = await StateStorage.collection.findOne({});
    this.initialSyncComplete =
      state && state.initialSyncComplete && state.initialSyncComplete.includes(`${chain}:${network}`);
    let tip = await ChainStateProvider.getLocalTip({ chain, network });
    if (parentChain && (!tip || tip.height < forkHeight)) {
      let parentTip = await ChainStateProvider.getLocalTip({ chain: parentChain, network });
      while (!parentTip || parentTip.height < forkHeight) {
        logger.info(`Waiting until ${parentChain} syncs before ${chain} ${network}`);
        await wait(5000);
        parentTip = await ChainStateProvider.getLocalTip({ chain: parentChain, network });
      }
    }

    const getHeaders = async () => {
      const locators = await ChainStateProvider.getLocatorHashes({ chain, network });
      return this.getHeaders(locators);
    };

    let headers = await getHeaders();
    while (headers.length > 0) {
      tip = await ChainStateProvider.getLocalTip({ chain, network });
      let currentHeight = tip ? tip.height : 0;
      const startingHeight = currentHeight;
      const startingTime = Date.now();
      let lastLog = startingTime;
      logger.info(`${timestamp()} | Syncing ${headers.length} blocks | Chain: ${chain} | Network: ${network}`);
      for (const header of headers) {
        try {
          const block = await this.getBlock(header.hash);
          await this.processBlock(block);
          currentHeight++;
          const now = Date.now();
          const oneSecond = 1000;
          if (now - lastLog > oneSecond) {
            const blocksProcessed = currentHeight - startingHeight;
            const elapsedMinutes = (now - startingTime) / (60 * oneSecond);
            logger.info(
              `${timestamp()} | Syncing... | Chain: ${chain} | Network: ${network} |${(blocksProcessed / elapsedMinutes)
                .toFixed(2)
                .padStart(8)} blocks/min | Height: ${currentHeight.toString().padStart(7)}`
            );
            lastLog = now;
          }
        } catch (err) {
          logger.error(`${timestamp()} | Error syncing | Chain: ${chain} | Network: ${network} | %o`, err);
          this.isSyncing = false;
          return this.sync();
        }
      }
      headers = await getHeaders();
    }

    logger.info(`${timestamp()} | Sync completed | Chain: ${chain} | Network: ${network}`);
    this.isSyncing = false;
    await StateStorage.collection.findOneAndUpdate(
      {},
      { $addToSet: { initialSyncComplete: `${chain}:${network}` } },
      { upsert: true }
    );
    this.events.emit('SYNCDONE');
    return true;
  }

  async stop() {
    this.stopping = true;
    logger.debug(`Stopping worker for chain ${this.chain}`);
    this.queuedRegistrations.forEach(clearTimeout);
    await this.unregisterSyncingNode();
    await this.disconnect();
  }

  async start() {
    logger.debug(`Started worker for chain ${this.chain}`);
    await this.connect();
    this.refreshSyncingNode();
  }
}