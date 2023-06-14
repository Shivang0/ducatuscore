import * as CWC from 'crypto-wallet-core';
import _ from 'lodash';
import { logger } from '../logger';

const $ = require('preconditions').singleton();
const ducatuscore = require('@ducatus/ducatuscore-lib');
const crypto = ducatuscore.crypto;
const secp256k1 = require('secp256k1');
const Ducatuscore = require('@ducatus/ducatuscore-lib');
const Ducatuscore_ = {
  btc: Ducatuscore,
  bch: require('@ducatus/ducatuscore-lib-cash'),
  doge: require('@ducatus/ducatuscore-lib-doge'),
  ltc: require('@ducatus/ducatuscore-lib-ltc')
};

export class Utils {
  static getMissingFields(obj, args) {
    args = [].concat(args);
    if (!_.isObject(obj)) return args;
    const missing = _.filter(args, arg => {
      return !obj.hasOwnProperty(arg);
    });
    return missing;
  }

  /**
   *
   * @desc rounds a JAvascript number
   * @param number
   * @return {number}
   */
  static strip(number) {
    return parseFloat(number.toPrecision(12));
  }

  /* TODO: It would be nice to be compatible with bitcoind signmessage. How
   * the hash is calculated there? */
  static hashMessage(text, noReverse) {
    $.checkArgument(text);
    const buf = Buffer.from(text);
    let ret = crypto.Hash.sha256sha256(buf);
    if (!noReverse) {
      ret = new ducatuscore.encoding.BufferReader(ret).readReverse();
    }
    return ret;
  }

  static verifyMessage(message, signature, publicKey) {
    $.checkArgument(message);

    const flattenedMessage = _.isArray(message) ? _.join(message) : message;
    const hash = Utils.hashMessage(flattenedMessage, true);

    const sig = this._tryImportSignature(signature);
    if (!sig) {
      return false;
    }

    const publicKeyBuffer = this._tryImportPublicKey(publicKey);
    if (!publicKeyBuffer) {
      return false;
    }

    return this._tryVerifyMessage(hash, sig, publicKeyBuffer);
  }

  static _tryImportPublicKey(publicKey) {
    let publicKeyBuffer = publicKey;
    try {
      if (!Buffer.isBuffer(publicKey)) {
        publicKeyBuffer = Buffer.from(publicKey, 'hex');
      }
      return publicKeyBuffer;
    } catch (e) {
      logger.error('_tryImportPublicKey encountered an error: %o', e);
      return false;
    }
  }

  static _tryImportSignature(signature) {
    try {
      let signatureBuffer = signature;
      if (!Buffer.isBuffer(signature)) {
        signatureBuffer = Buffer.from(signature, 'hex');
      }
      // uses the native module (c++) for performance vs ducatuscore lib (javascript)
      return secp256k1.signatureImport(signatureBuffer);
    } catch (e) {
      logger.error('_tryImportSignature encountered an error: %o', e);
      return false;
    }
  }

  static _tryVerifyMessage(hash, sig, publicKeyBuffer) {
    try {
      // uses the native module (c++) for performance vs ducatuscore lib (javascript)
      return secp256k1.ecdsaVerify(sig, hash, publicKeyBuffer);
    } catch (e) {
      logger.error('_tryVerifyMessage encountered an error: %o', e);
      return false;
    }
  }

  static formatAmount(satoshis, unit, opts) {
    const UNITS = Object.entries(CWC.Constants.UNITS).reduce((units, [currency, currencyConfig]) => {
      units[currency] = {
        toSatoshis: currencyConfig.toSatoshis,
        maxDecimals: currencyConfig.short.maxDecimals,
        minDecimals: currencyConfig.short.minDecimals
      };
      return units;
    }, {} as { [currency: string]: { toSatoshis: number; maxDecimals: number; minDecimals: number } });

    $.shouldBeNumber(satoshis);

    function addSeparators(nStr, thousands, decimal, minDecimals) {
      nStr = nStr.replace('.', decimal);
      const x = nStr.split(decimal);
      let x0 = x[0];
      let x1 = x[1];

      x1 = _.dropRightWhile(x1, (n, i) => {
        return n == '0' && i >= minDecimals;
      }).join('');
      const x2 = x.length > 1 ? decimal + x1 : '';

      x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return x0 + x2;
    }

    opts = opts || {};

    if (!UNITS[unit] && !opts.decimals && !opts.toSatoshis) {
      return Number(satoshis).toLocaleString();
    }

    const u = _.assign(UNITS[unit], opts);
    var decimals = opts.decimals ? opts.decimals : u;
    var toSatoshis = opts.toSatoshis ? opts.toSatoshis : u.toSatoshis;

    const amount = (satoshis / toSatoshis).toFixed(decimals.maxDecimals);
    return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', decimals.minDecimals);
  }

  static formatAmountInBtc(amount) {
    return (
      Utils.formatAmount(amount, 'btc', {
        minDecimals: 8,
        maxDecimals: 8
      }) + 'btc'
    );
  }

  static formatUtxos(utxos) {
    if (_.isEmpty(utxos)) return 'none';
    return _.map([].concat(utxos), i => {
      const amount = Utils.formatAmountInBtc(i.satoshis);
      const confirmations = i.confirmations ? i.confirmations + 'c' : 'u';
      return amount + '/' + confirmations;
    }).join(', ');
  }

  static formatRatio(ratio) {
    return (ratio * 100).toFixed(4) + '%';
  }

  static formatSize(size) {
    return (size / 1000).toFixed(4) + 'kB';
  }

  static parseVersion(version) {
    const v: {
      agent?: string;
      major?: number;
      minor?: number;
      patch?: number;
    } = {};

    if (!version) return null;

    let x = version.split('-');
    if (x.length != 2) {
      v.agent = version;
      return v;
    }
    v.agent = _.includes(['dwc', 'dws'], x[0]) ? 'dwc' : x[0];
    x = x[1].split('.');
    v.major = x[0] ? parseInt(x[0]) : null;
    v.minor = x[1] ? parseInt(x[1]) : null;
    v.patch = x[2] ? parseInt(x[2]) : null;

    return v;
  }

  static parseAppVersion(agent) {
    const v: {
      app?: string;
      major?: number;
      minor?: number;
      patch?: number;
    } = {};
    if (!agent) return null;
    agent = agent.toLowerCase();

    let w;
    w = agent.indexOf('copay');
    if (w >= 0) {
      v.app = 'copay';
    } else {
      w = agent.indexOf('bitpay');
      if (w >= 0) {
        v.app = 'bitpay';
      } else {
        v.app = 'other';
        return v;
      }
    }

    const version = agent.substr(w + v.app.length);
    const x = version.split('.');
    v.major = x[0] ? parseInt(x[0].replace(/\D/g, '')) : null;
    v.minor = x[1] ? parseInt(x[1]) : null;
    v.patch = x[2] ? parseInt(x[2]) : null;

    return v;
  }

  static getIpFromReq(req): string {
    if (req.headers) {
      if (req.headers['x-forwarded-for']) return req.headers['x-forwarded-for'].split(',')[0];
      if (req.headers['x-real-ip']) return req.headers['x-real-ip'].split(',')[0];
    }
    if (req.ip) return req.ip;
    if (req.connection && req.connection.remoteAddress) return req.connection.remoteAddress;
    return '';
  }

  static checkValueInCollection(value, collection) {
    if (!value || !_.isString(value)) return false;
    return _.includes(_.values(collection), value);
  }

  static getAddressCoin(address) {
    try {
      new Ducatuscore_['btc'].Address(address);
      return 'btc';
    } catch (e) {
      try {
        new Ducatuscore_['bch'].Address(address);
        return 'bch';
      } catch (e) {
        try {
          new Ducatuscore_['doge'].Address(address);
          return 'doge';
        } catch (e) {
          try {
            new Ducatuscore_['ltc'].Address(address);
            return 'ltc';
          } catch (e) {
            return;
          }
        }
      }
    }
  }

  static translateAddress(address, coin) {
    const origCoin = Utils.getAddressCoin(address);
    const origAddress = new Ducatuscore_[origCoin].Address(address);
    const origObj = origAddress.toObject();

    const result = Ducatuscore_[coin].Address.fromObject(origObj);
    return coin == 'bch' ? result.toLegacyAddress() : result.toString();
  }
}