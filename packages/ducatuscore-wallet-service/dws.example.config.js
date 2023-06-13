module.exports = {
  basePath: '/dws/api',
  disableLogs: false,
  port: 3232,

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
      uri: 'mongodb://localhost:27017/dws',
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
    authorizationKey: 'You_have_to_put_something_here'
  },
  fiatRateServiceOpts: {
    defaultProvider: 'BitPay',
    fetchInterval: 5 // in minutes
  },
  maintenanceOpts: {
    maintenanceMode: false
  },
  services: {
    buyCrypto: { simplexPromotion202002: false }
  },
  suspendedChains: [],
  staticRoot: '/tmp/static'
  // To use email notifications uncomment this:
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
