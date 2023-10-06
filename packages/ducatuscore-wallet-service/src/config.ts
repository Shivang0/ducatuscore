import _ from 'lodash';
import { logger } from './lib/logger';

const { 
  DUCX_NODE_URL, 
  DUC_NODE_URL,
  EXCHANGER_LIVENET_URL, 
  EXCHANGER_TESTNET_URL,
  DB_HOST, 
  MSG_HOST,
  FCM_KEY,
  SOCKET_API_KEY,
  DWS_PORT,
  MSG_PORT
} = process.env;
const ducxNode = `http://${DUCX_NODE_URL}` || 'http://localhost:3000';
const ducNode = `http://${DUC_NODE_URL}` || 'http://localhost:3000';
const ducxNodeWs = `ws://${DUCX_NODE_URL}` || 'ws://localhost:3000';
const ducNodeWs = `ws://${DUC_NODE_URL}` || 'ws://localhost:3000';

const Config = () => {
  let defaultConfig = {
    basePath: '/dws/api',
    disableLogs: false,
    port: DWS_PORT,
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
        url: MSG_HOST ? `http://${MSG_HOST}:${MSG_PORT}` : 'http://localhost:3380'
      }
    },
    blockchainExplorerOpts: {
      btc: {
        livenet: {
          url: 'https://api.bitcore.io',
          wsUrl:'https://api.bitcore.io'
        },
        testnet: {
          url: 'https://api.bitcore.io',
          wsUrl:'https://api.bitcore.io',
          regtestEnabled: false
        }
      },
      bch: {
        livenet: {
          url: 'https://api.bitcore.io',
          wsUrl:'https://api.bitcore.io'
        },
        testnet: {
          url: 'https://api.bitcore.io',
          wsUrl:'https://api.bitcore.io'
        }
      },
      eth: {
        livenet: {
          url: 'https://api-eth.bitcore.io',
          wsUrl:'https://api-eth.bitcore.io'
        },
        testnet: {
          url: 'https://api-eth.bitcore.io',
          wsUrl:'https://api-eth.bitcore.io'
        }
      },
      duc: {
        livenet: {
          url: ducNode,
          wsUrl: ducNodeWs
        },
        testnet: {
          url: ducNode,
          wsUrl: ducNodeWs,
          regtestEnabled: false
        }
      },
      ducx: {
        livenet: {
          url: ducxNode,
          wsUrl: ducxNodeWs
        },
        testnet: {
          url: ducxNode,
          wsUrl: ducxNodeWs
        }
      },
      xrp: {
        livenet: {
          url: 'https://api-xrp.bitcore.io',
          wsUrl:'https://api-xrp.bitcore.io'
        },
        testnet: {
          url: 'https://api-xrp.bitcore.io',
          wsUrl:'https://api-xrp.bitcore.io'
        }
      },
      socketApiKey: SOCKET_API_KEY,
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
