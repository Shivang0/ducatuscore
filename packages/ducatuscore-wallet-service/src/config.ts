import _ from 'lodash';
import { logger } from './lib/logger';

const { 
  MODE, 
  DUCX_NODE_PROD_URL, 
  DUCX_NODE_DEV_URL, 
  DUCX_NODE_LOCAL_URL, 
  DUC_NODE_PROD_URL, 
  DUC_NODE_DEV_URL, 
  DUC_NODE_LOCAL_URL, 
  EXCHANGER_LIVENET_URL, 
  EXCHANGER_TESTNET_URL,
  DB_HOST, 
  MSG_HOST,
  FCM_KEY,
} = process.env;
const defaultMode = 'prod';
const mode: 'prod' | 'dev' | 'local' = (MODE as 'prod' | 'dev' | 'local') || defaultMode;
const ducxNode = {
  prod: DUCX_NODE_PROD_URL || 'https://ducapi.rocknblock.io',
  dev: DUCX_NODE_DEV_URL || 'http://localhost:3000',
  local: DUCX_NODE_LOCAL_URL || 'http://localhost:3000'
};
const ducNode = {
  prod: DUC_NODE_PROD_URL || 'https://ducapi.rocknblock.io',
  dev: DUC_NODE_DEV_URL || 'http://localhost:3000',
  local: DUC_NODE_LOCAL_URL || 'http://localhost:3000'
};

const Config = () => {
  let defaultConfig = {
    basePath: '/dws/api',
    disableLogs: false,
    port: 3232,
    exchangerUrl: {
      livenet: EXCHANGER_LIVENET_URL || 'https://www.ducatuscoins.com',
      testnet: EXCHANGER_TESTNET_URL || 'https://devducatus.rocknblock.io'
    },
    // Uncomment to make DWS a forking server
    // cluster: true,

    // Uncomment to set the number or process (will use the nr of availalbe CPUs by default)
    // clusterInstances: 4,

    // https: true,
    // privateKeyFile: 'private.pem',
    // certificateFile: 'cert.pem',
    ////// The following is only for certs which are not
    ////// trusted by nodejs 'https' by default
    ////// CAs like Verisign do not require this
    // CAinter1: '', // ex. 'COMODORSADomainValidationSecureServerCA.crt'
    // CAinter2: '', // ex. 'COMODORSAAddTrustCA.crt'
    // CAroot: '', // ex. 'AddTrustExternalCARoot.crt'

    storageOpts: {
      mongoDb: {
        uri: DB_HOST ? `mongodb://${DB_HOST}:27017/dws` : 'mongodb://localhost:27017/dws',
        dbname: 'dws'
      }
    },
    messageBrokerOpts: {
      //  To use message broker server, uncomment this:
      messageBrokerServer: {
        url: MSG_HOST ? `http://${MSG_HOST}:3380` : 'http://localhost:3380'
      }
    },
    blockchainExplorerOpts: {
      btc: {
        livenet: {
          url: 'https://api.bitcore.io'
        },
        testnet: {
          url: 'https://api.bitcore.io',
          regtestEnabled: false
        }
      },
      bch: {
        livenet: {
          url: 'https://api.bitcore.io'
        },
        testnet: {
          url: 'https://api.bitcore.io'
        }
      },
      eth: {
        livenet: {
          url: 'https://api-eth.bitcore.io'
        },
        testnet: {
          url: 'https://api-eth.bitcore.io'
        }
      },
      duc: {
        livenet: {
          url: ducxNode[mode]
        },
        testnet: {
          url: ducxNode[mode],
          regtestEnabled: false
        }
      },
      ducx: {
        livenet: {
          url: ducxNode[mode]
        },
        testnet: {
          url: ducxNode[mode]
        }
      },
      xrp: {
        livenet: {
          url: 'https://api-xrp.bitcore.io'
        },
        testnet: {
          url: 'https://api-xrp.bitcore.io'
        }
      },
      socketApiKey: 'socketApiKey'
    },
    pushNotificationsOpts: {
      defaultLanguage: 'en',
      defaultUnit: 'btc',
      subjectPrefix: '',
      pushServerUrl: 'https://fcm.googleapis.com/fcm',
      authorizationKey: FCM_KEY,
    },
    fiatRateServiceOpts: {
      defaultProvider: 'BitPay',
      fetchInterval: 5 // in minutes
    },
    maintenanceOpts: {
      maintenanceMode: false
    },
    suspendedChains: [],
    staticRoot: '/tmp/static'
  };

  // Override default values with dws.config.js' values, if present
  try {
    const dwsConfig = require('../dws.config');
    defaultConfig = _.merge(defaultConfig, dwsConfig);
  } catch {
    logger.info('dws.config.js not found, using default configuration values');
  }
  return defaultConfig;
};

module.exports = Config();
