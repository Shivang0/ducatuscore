import * as _ from 'lodash';
import { cpus, homedir } from 'os';
import { ConfigType } from './types/Config';
import parseArgv from './utils/parseArgv';
let program = parseArgv([], ['config']);

function findConfig(): ConfigType | undefined {
  let foundConfig;
  const envConfigPath = process.env.DUCATUSCORE_CONFIG_PATH;
  const argConfigPath = program.config;
  const configFileName = 'ducatuscore.config.json';
  let ducatuscoreConfigPaths = [
    `${homedir()}/${configFileName}`,
    `../../../../${configFileName}`,
    `../../${configFileName}`
  ];
  const overrideConfig = argConfigPath || envConfigPath;
  if (overrideConfig) {
    ducatuscoreConfigPaths.unshift(overrideConfig);
  }
  // No config specified. Search home, ducatuscore and cur directory
  for (let path of ducatuscoreConfigPaths) {
    if (!foundConfig) {
      try {
        const expanded = path[0] === '~' ? path.replace('~', homedir()) : path;
        const ducatuscoreConfig = require(expanded) as { ducatuscoreNode: ConfigType };
        foundConfig = ducatuscoreConfig.ducatuscoreNode;
      } catch (e) {
        foundConfig = undefined;
      }
    }
  }
  return foundConfig;
}

function setTrustedPeers(config: ConfigType): ConfigType {
  for (let [chain, chainObj] of Object.entries(config)) {
    for (let network of Object.keys(chainObj)) {
      let env = process.env;
      const envString = `TRUSTED_${chain.toUpperCase()}_${network.toUpperCase()}_PEER`;
      if (env[envString]) {
        let peers = config.chains[chain][network].trustedPeers || [];
        peers.push({
          host: env[envString] as string,
          port: env[`${envString}_PORT`] as string
        });
        config.chains[chain][network].trustedPeers = peers;
      }
    }
  }
  return config;
}
const Config = function(): ConfigType {
  let config: ConfigType = {
    maxPoolSize: 50,
    port: 3000,
    dbUrl: process.env.DB_URL || '',
    dbHost: process.env.DB_HOST || '127.0.0.1',
    dbName: process.env.DB_NAME || 'ducatuscore',
    dbPort: process.env.DB_PORT || '27017',
    dbUser: process.env.DB_USER || '',
    dbPass: process.env.DB_PASS || '',
    numWorkers: cpus().length,
    chains: {},
    modules: ['./bitcoin', './bitcoin-cash', './ethereum', './ducatus', './ducx'],
    services: {
      api: {
        rateLimiter: {
          disabled: false,
          whitelist: process.env.NODE_WHITE_LIST ? process.env.NODE_WHITE_LIST.split(',') : ['::ffff:127.0.0.1', '::1']
        },
        wallets: {
          allowCreationBeforeCompleteSync: false,
          allowUnauthenticatedCalls: false
        }
      },
      event: {
        onlyWalletEvents: false
      },
      p2p: {},
      socket: {
        dwsKeys: process.env.DWS_KEYS ? process.env.DWS_KEYS.split(',') : [],
      },
      storage: {}
    }
  };

  let foundConfig = findConfig();
  const mergeCopyArray = (objVal, srcVal) => (objVal instanceof Array ? srcVal : undefined);
  config = _.mergeWith(config, foundConfig, mergeCopyArray);
  if (!Object.keys(config.chains).length) {
    Object.assign(config.chains, {
      BTC: {
        mainnet: {
          chainSource: 'p2p',
          trustedPeers: [{ host: '127.0.0.1', port: 8333 }],
          rpc: {
            host: '127.0.0.1',
            port: 8332,
            username: 'bitcoin',
            password: 'bitcoin'
          }
        }
      },
      DUC: {
        mainnet: {
          chainSource: 'p2p',
          trustedPeers: [{ host: '127.0.0.1', port: 9691 }],
          rpc: {
            host: '127.0.0.1',
            port: 9690,
            username: 'username',
            password: 'password'
          }
        }
      }
    });
  }
  config = setTrustedPeers(config);
  return config;
};

export default Config();
