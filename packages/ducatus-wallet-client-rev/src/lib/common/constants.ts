'use strict';

export const Constants = {
  SCRIPT_TYPES: {
    P2SH: 'P2SH',
    P2PKH: 'P2PKH',
    P2WPKH: 'P2WPKH',
    P2WSH: 'P2WSH'
  },
  // not used, since Credentials 2.0
  DERIVATION_STRATEGIES: {
    BIP44: 'BIP44',
    BIP45: 'BIP45',
    BIP48: 'BIP48'
  },
  PATHS: {
    SINGLE_ADDRESS: 'm/0/0',
    REQUEST_KEY: "m/1'/0",
    //  TXPROPOSAL_KEY: "m/1'/1",
    REQUEST_KEY_AUTH: 'm/2' // relative to BASE
  },
  BIP45_SHARED_INDEX: 0x80000000 - 1,
  UNITS: {
    btc: {
      toSatoshis: 100000000,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    duc: {
      toSatoshis: 100000000,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    bch: {
      toSatoshis: 100000000,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    eth: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    xrp: {
      toSatoshis: 1e6,
      full: {
        maxDecimals: 6,
        minDecimals: 6
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    ducx: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    usdc: {
      toSatoshis: 1e6,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    usdt: {
      toSatoshis: 1e6,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    pax: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    gusd: {
      toSatoshis: 1e2,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    bit: {
      toSatoshis: 100,
      full: {
        maxDecimals: 2,
        minDecimals: 2
      },
      short: {
        maxDecimals: 0,
        minDecimals: 0
      }
    },
    jamasy: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    nuyasa: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    sunoba: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    dscmed: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    pog1: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    wde: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    mdxb: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    'g.o.l.d.': {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    jwan: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    tkf: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    },
    'aa+': {
      toSatoshis: 1e5,
      full: {
        maxDecimals: 5,
        minDecimals: 5
      },
      short: {
        maxDecimals: 5,
        minDecimals: 2
      }
    },
    qmn: {
      toSatoshis: 1e3,
      full: {
        maxDecimals: 3,
        minDecimals: 3
      },
      short: {
        maxDecimals: 3,
        minDecimals: 2
      }
    },
    mpe: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 8,
        minDecimals: 2
      }
    }
  },
  COINS: [
    'btc',
    'bch',
    'eth',
    'xrp',
    'usdc',
    'usdt',
    'pax',
    'gusd',
    'duc',
    'ducx',
    'jamasy',
    'nuyasa',
    'sunoba',
    'dscmed',
    'pog1',
    'wde',
    'mdxb',
    'g.o.l.d.',
    'jwan',
    'tkf',
    'AA+',
    'QMN',
    'mpe'
  ],
  ERC20: ['usdc', 'usdt', 'pax', 'gusd'],
  DRC20: ['jamasy', 'nuyasa', 'sunoba', 'dscmed', 'pog1', 'wde', 'mdxb', 'g.o.l.d.', 'jwan', 'tkf', 'aa+', 'qmn', 'mpe'],
  UTXO_COINS: ['btc', 'bch', 'duc'],
  TOKEN_OPTS: {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
      name: 'USD Coin',
      symbol: 'USDC',
      decimal: 6,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    '0xdac17f958d2ee523a2206206994597c13d831ec7': {
      name: 'Tether USD',
      symbol: 'USDT',
      decimal: 6,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    },
    '0x8e870d67f660d95d5be530380d0ec0bd388289e1': {
      name: 'Paxos Standard',
      symbol: 'PAX',
      decimal: 18,
      address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1'
    },
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': {
      name: 'Gemini Dollar',
      symbol: 'GUSD',
      decimal: 2,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    '0xa9CB8e18E4C2C0a1C9Bf4367E7115165ed7e41F0': {
      name: 'JAMASY',
      symbol: 'JAMASY',
      decimal: 8,
      address: '0xa9CB8e18E4C2C0a1C9Bf4367E7115165ed7e41F0'
    },
    '0x3D30806b1E1F021Fe12DF506C3A1F96CfB94464a': {
      name: 'NUYASA',
      symbol: 'NUYASA',
      decimal: 8,
      address: '0x3D30806b1E1F021Fe12DF506C3A1F96CfB94464a'
    },
    '0xB7A7221E37d12A8Ea92468F283422B16DbC364D9': {
      name: 'SUNOBA',
      symbol: 'SUNOBA',
      decimal: 8,
      address: '0xB7A7221E37d12A8Ea92468F283422B16DbC364D9'
    },
    '0x14460383feFFE73eA1FB4F0F11B941F44c17bDD2': {
      name: 'DSCMED',
      symbol: 'DSCMED',
      decimal: 8,
      address: '0x14460383feFFE73eA1FB4F0F11B941F44c17bDD2'
    },
    '0x511e1f8e872c3fe9b3fCefEf58ec7FE4E8130Cc1': {
      name: 'POG1',
      symbol: 'POG1',
      decimal: 8,
      address: '0x511e1f8e872c3fe9b3fCefEf58ec7FE4E8130Cc1'
    },
    '0x17CaCa02DDf472F62bFED5165FACf7A6B5C72926': {
      name: 'WupDE',
      symbol: 'WDE',
      decimal: 8,
      address: '0x17CaCa02DDf472F62bFED5165FACf7A6B5C72926'
    },
    '0x60DFde24CdE54df342E52a72248B2bD54e0ea4A5': {
      name: 'MarsaDXB',
      symbol: 'MDXB',
      decimal: 8,
      address: '0x60DFde24CdE54df342E52a72248B2bD54e0ea4A5'
    },
    '0xcDdd562C0cF8c262AD8A5c1A476cdBBE114FcC28': {
      name: 'G.O.L.D.',
      symbol: 'G.O.L.D.',
      decimal: 18,
      address: '0xcDdd562C0cF8c262AD8A5c1A476cdBBE114FcC28'
    },
    '0xFCb965D9Da10A15eb87B3Da539383997ce6fA597': {
      name: 'Jwan',
      symbol: 'JWAN',
      decimal: 8,
      address: '0xFCb965D9Da10A15eb87B3Da539383997ce6fA597'
    },
    '0xA75185edc9745B000379e8304deBA5DeAbB39f30': {
      name: 'Takaful',
      symbol: 'TKF',
      decimal: 8,
      address: '0xA75185edc9745B000379e8304deBA5DeAbB39f30'
    },
    '0x986083CD47dBBC931585D2FE2330FD29B3e849b0': {
      name: 'AA+',
      symbol: 'AA+',
      decimal: 5,
      address: '0x986083CD47dBBC931585D2FE2330FD29B3e849b0'
    },
    '0x9Ddc5c88e27231c3DF4424ABd7508c70f748fc4A': {
      name: 'Queen Margherita Napoli',
      symbol: 'QMN',
      decimal: 3,
      address: '0x9Ddc5c88e27231c3DF4424ABd7508c70f748fc4A'
    },
    '0x212bbB33b6A56a7Ee0819dd82bE01c285F64Fb49': {
      name: 'My Planet Earth',
      symbol: 'MPE',
      decimal: 8,
      address: '0x212bbB33b6A56a7Ee0819dd82bE01c285F64Fb49'
    },
  }
};
