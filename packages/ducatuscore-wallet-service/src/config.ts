import _ from 'lodash';
import { logger } from './lib/logger';

const Config = () => {
  let defaultConfig = {
    basePath: '/dws/api',
    disableLogs: false,
    port: 3232,

    // Uncomment to make BWS a forking server
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
        uri: 'mongodb://localhost:27017/bws',
        dbname: 'dws'
      }
    },
    messageBrokerOpts: {
      //  To use message broker server, uncomment this:
      messageBrokerServer: {
        url: 'http://localhost:3380'
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
      matic: {
        livenet: {
          url: 'https://api-matic.bitcore.io'
        },
        testnet: {
          url: 'https://api-matic.bitcore.io'
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
      doge: {
        livenet: {
          url: 'https://api.bitcore.io'
        },
        testnet: {
          url: 'https://api.bitcore.io'
        }
      },
      ltc: {
        livenet: {
          url: 'https://api.bitcore.io'
        },
        testnet: {
          url: 'https://api.bitcore.io'
        }
      },
      socketApiKey: 'socketApiKey'
    },
    pushNotificationsOpts: {
      templatePath: 'templates',
      defaultLanguage: 'en',
      defaultUnit: 'btc',
      subjectPrefix: '',
      pushServerUrl: 'https://fcm.googleapis.com/fcm',
      pushServerUrlBraze: 'https://rest.iad-05.braze.com',
      authorizationKey: 'You_have_to_put_something_here',
      authorizationKeyBraze: 'You_have_to_put_something_here'
    },
    fiatRateServiceOpts: {
      defaultProvider: 'BitPay',
      fetchInterval: 5 // in minutes
    },
    maintenanceOpts: {
      maintenanceMode: false
    },
    services: {
      buyCrypto: {
        disabled: false,
        moonpay: {
          disabled: false,
          removed: false
        },
        ramp: {
          disabled: false,
          removed: false
        },
        sardine: {
          disabled: false,
          removed: false
        },
        simplex: {
          disabled: false,
          removed: false
        },
        wyre: {
          disabled: false,
          removed: false
        }
      },
      swapCrypto: { 
        disabled: false,
        changelly: {
          disabled: false,
          removed: false
        }
      },
    },
    suspendedChains: [],
    staticRoot: '/tmp/static'
    // emailOpts: {
    //  host: 'localhost',
    //  port: 25,
    //  ignoreTLS: true,
    //  subjectPrefix: '[Wallet Service]',
    //  from: 'wallet-service@some.io',
    //  templatePath: 'templates',
    //  defaultLanguage: 'en',
    //  defaultUnit: 'btc',
    //  publicTxUrlTemplate: {
    //   btc: {
    //     livenet: 'https://bitpay.com/insight/#/BTC/mainnet/tx/{{txid}}',
    //     testnet: 'https://bitpay.com/insight/#/BTC/testnet/tx/{{txid}}',
    //   },
    //   bch: {
    //     livenet: 'https://bitpay.com/insight/#/BCH/mainnet/tx/{{txid}}',
    //     testnet: 'https://bitpay.com/insight/#/BCH/testnet/tx/{{txid}}',
    //   },
    //   eth: {
    //     livenet: 'https://etherscan.io/tx/{{txid}}',
    //     testnet: 'https://kovan.etherscan.io/tx/{{txid}}',
    //   },
    //   xrp: {
    //     livenet: 'https://xrpscan.com/tx/{{txid}}',
    //     testnet: 'https://test.bithomp.com/explorer//tx/{{txid}}',
    //   },
    //   doge: {
    //     livenet: 'https://blockchair.com/dogecoin/transaction/{{txid}}',
    //     testnet: 'https://sochain.com/tx/DOGETEST/{{txid}}',
    //  },
    //   ltc: {
    //     livenet: 'https://bitpay.com/insight/#/LTC/mainnet/tx/{{txid}}',
    //     testnet: 'https://bitpay.com/insight/#/LTC/testnet/tx/{{txid}}',
    //  }
    // },
    // },
    // To use sendgrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //
    //
    // //then add:
    // mailer: sgMail,
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
