import { Transactions, Validation } from '@ducatus/ducatus-crypto-wallet-core-rev';
import { Big } from 'big.js';
import _ from 'lodash';
import { IAddress } from 'src/lib/model/address';
import { IChain } from '..';

const Common = require('../../common');
const Defaults = Common.Defaults;
const Errors = require('../../errors/errordefinitions');

export class DucXChain implements IChain {
  /**
   * Converts Bitcore Balance Response.
   * @param {Object} bitcoreBalance - { unconfirmed, confirmed, balance }
   * @param {Number} locked - Sum of txp.amount
   * @returns {Object} balance - Total amount & locked amount.
   */
  private convertBitcoreBalance(bitcoreBalance, locked) {
    const { confirmed, balance } = bitcoreBalance;
    // We ASUME all locked as confirmed, for ETH.
    const convertedBalance = {
      totalAmount: balance,
      totalConfirmedAmount: confirmed,
      lockedAmount: locked,
      lockedConfirmedAmount: locked,
      availableAmount: balance - locked,
      availableConfirmedAmount: confirmed - locked,
      byAddress: []
    };

    return convertedBalance;
  }

  notifyConfirmations() {
    return false;
  }

  supportsMultisig() {
    return false;
  }

  getWalletBalance(server, wallet, opts, cb) {
    const bc = server._getBlockchainExplorer(wallet.coin, wallet.network);

    if (opts.tokenAddress) {
      const isSwapContract = Boolean(
        '0xd62680378AdeD4277f74ac69fd1A4518586bDd08' === opts.tokenAddress ||
          '0x82019a24091bb67c53C558132E44e74E28aa1c75' === opts.tokenAddress
      );
      if (!isSwapContract) {
        wallet.tokenAddress = opts.tokenAddress;
      }
    }

    bc.getBalance(wallet, (err, balance) => {
      console.log(balance, err, 'balance');

      if (err) {
        return cb(err);
      }

      server.getPendingTxs(opts, (err, txps) => {
        if (err) return cb(err);

        const lockedSum = _.sumBy(txps, 'amount') || 0;
        const convertedBalance = this.convertBitcoreBalance(balance, lockedSum);

        server.storage.fetchAddresses(server.walletId, (err, addresses: IAddress[]) => {
          if (err) return cb(err);

          if (addresses.length > 0) {
            const byAddress = [
              {
                address: addresses[0].address,
                path: addresses[0].path,
                amount: convertedBalance.totalAmount
              }
            ];
            convertedBalance.byAddress = byAddress;
          }

          return cb(null, convertedBalance);
        });
      });
    });
  }

  getWalletSendMaxInfo(server, wallet, opts, cb) {
    server.getBalance({}, (err, balance) => {
      if (err) return cb(err);

      const availableAmount = new Big(balance.availableAmount);
      const feePerKb = new Big(opts.feePerKb);
      const fee = feePerKb
        .times(Defaults.DEFAULT_DUCX_GAS_LIMIT)
        .toNumber()
        .toFixed();
      const amount = availableAmount
        .minus(fee)
        .toNumber()
        .toFixed();

      return cb(null, {
        utxosBelowFee: 0,
        amountBelowFee: 0,
        amount: Number(amount),
        feePerKb: opts.feePerKb,
        fee: Number(fee)
      });
    });
  }

  getDustAmountValue() {
    return 0;
  }

  getTransactionCount(server, wallet, from) {
    return new Promise((resolve, reject) => {
      server._getTransactionCount(wallet, from, (err, nonce) => {
        if (err) return reject(err);

        return resolve(nonce);
      });
    });
  }

  getChangeAddress() {}

  checkDust(output, opts) {}

  getFee(server, wallet, opts) {
    return new Promise(resolve => {
      server._getFeePerKb(wallet, opts, async (err, inFeePerKb) => {
        let feePerKb = inFeePerKb;
        let gasPrice = inFeePerKb;
        const { from } = opts;
        const { coin, network } = wallet;
        let inGasLimit;

        for (let output of opts.outputs) {
          try {
            inGasLimit = await server.estimateGas({
              coin,
              network,
              from,
              to: opts.tokenAddress || output.toAddress,
              value: opts.tokenAddress ? 0 : output.amount,
              data: output.data,
              gasPrice
            });

            if (opts.isContractCall) {
              output.gasLimit = Defaults.DEFAULT_DUCX_CONTRACT_GAS_LIMIT;
            } else if (inGasLimit) {
              output.gasLimit = inGasLimit;
            } else if (opts.tokenAddress) {
              output.gasLimit = Defaults.DEFAULT_DRC20_GAS_LIMIT;
            } else {
              output.gasLimit = Defaults.DEFAULT_DUCX_GAS_LIMIT;
            }
          } catch (err) {
            if (opts.tokenAddress) {
              output.gasLimit = Defaults.DEFAULT_DRC20_GAS_LIMIT;
            } else if (opts.isContractCall) {
              output.gasLimit = Defaults.DEFAULT_DUCX_CONTRACT_GAS_LIMIT;
            } else {
              output.gasLimit = Defaults.DEFAULT_DUCX_GAS_LIMIT;
            }
          }
        }

        if (_.isNumber(opts.fee)) {
          // This is used for sendmax
          const nFee = new Big(opts.fee);
          gasPrice = feePerKb = nFee
            .div(inGasLimit || Defaults.DEFAULT_DUCX_GAS_LIMIT)
            .toNumber()
            .toFixed();
        }

        let gasLimit: number;

        if (opts.isContractCall) {
          gasLimit = Defaults.DEFAULT_DUCX_CONTRACT_GAS_LIMIT;
        } else {
          gasLimit = inGasLimit || Defaults.DEFAULT_DUCX_GAS_LIMIT;
        }

        opts.fee = new Big(feePerKb)
          .times(gasLimit)
          .toNumber()
          .toFixed();

        return resolve({
          feePerKb: Number(feePerKb),
          gasPrice: Number(gasPrice),
          gasLimit: Number(gasLimit)
        });
      });
    });
  }

  buildTx(txp) {
    const { data, outputs, payProUrl, tokenAddress, tokenId } = txp;
    const isERC20 = tokenAddress && !payProUrl;
    const isERC721 = isERC20 && tokenId;

    let chain = isERC721 ? 'ERC721' : isERC20 ? 'DRC20' : 'DUCX';

    if (txp.wDucxAddress) {
      chain = 'TOB';
    }

    const recipients = outputs.map(output => {
      return {
        amount: output.amount,
        address: output.toAddress,
        data: output.data,
        gasLimit: output.gasLimit
      };
    });
    // Backwards compatibility BWC <= 8.9.0
    if (data) {
      recipients[0].data = data;
    }

    const unsignedTxs = [];

    for (let index = 0; index < recipients.length; index++) {
      const rawTx = Transactions.create({
        ...txp,
        ...recipients[index],
        chain,
        nonce: Number(txp.nonce) + Number(index),
        recipients: [recipients[index]]
      });
      console.log('rawTx', rawTx, txp);
      unsignedTxs.push(rawTx);
    }

    return {
      uncheckedSerialize: () => {
        console.log('uncheckedSerialize', unsignedTxs, txp);

        return unsignedTxs;
      },
      txid: () => txp.txid,
      toObject: () => {
        let ret = _.clone(txp);
        ret.outputs[0].satoshis = ret.outputs[0].amount;

        return ret;
      },
      getFee: () => {
        return txp.fee;
      },
      getChangeOutput: () => null
    };
  }

  convertFeePerKb(p, feePerKb) {
    return [p, feePerKb];
  }

  checkTx(server, txp) {
    try {
      txp.getBitcoreTx();
    } catch (ex) {
      server.logw('Error building Bitcore transaction', ex);
      return ex;
    }
  }

  checkTxUTXOs(server, txp, opts, cb) {
    return cb();
  }

  selectTxInputs(server, txp, wallet, opts, cb, next) {
    server.getBalance({ wallet, tokenAddress: opts.tokenAddress }, (err, balance) => {
      if (err) {
        return next(err);
      }

      const { totalAmount, availableAmount } = balance;
      const txTotalAmount = txp.getTotalAmount();
      const txTotalAmountAndFee = new Big(txTotalAmount).plus(txp.fee || 0).toNumber();

      if (totalAmount < txTotalAmount) {
        return cb(Errors.INSUFFICIENT_FUNDS);
      } else if (opts.tokenAddress) {
        if (totalAmount < txTotalAmount) {
          return cb(Errors.INSUFFICIENT_FUNDS);
        } else if (availableAmount < txTotalAmount) {
          return cb(Errors.LOCKED_FUNDS);
        } else {
          server.getBalance({}, (err, ethBalance) => {
            if (err) {
              return next(err);
            }

            const { totalAmount, availableAmount } = ethBalance;

            if (totalAmount < txp.fee) {
              return cb(Errors.INSUFFICIENT_DUCX_FEE);
            } else if (availableAmount < txp.fee) {
              return cb(Errors.LOCKED_DUCX_FEE);
            } else {
              return next(server._checkTx(txp));
            }
          });
        }
      } else {
        if (totalAmount < txTotalAmountAndFee) {
          return cb(Errors.INSUFFICIENT_FUNDS);
        } else if (availableAmount < txTotalAmountAndFee) {
          return cb(Errors.LOCKED_FUNDS);
        } else {
          return next(server._checkTx(txp));
        }
      }
    });
  }

  checkUtxos(opts) {}

  checkValidTxAmount(output): boolean {
    if (!_.isNumber(output.amount) || _.isNaN(output.amount) || output.amount < 0) {
      return false;
    }
    return true;
  }

  setInputs() {}

  isUTXOCoin() {
    return false;
  }
  isSingleAddress() {
    return true;
  }

  addressFromStorageTransform(network, address): void {
    if (network != 'livenet') {
      const x = address.address.indexOf(':' + network);

      if (x >= 0) {
        address.address = address.address.substr(0, x);
      }
    }
  }

  addressToStorageTransform(network, address): void {
    if (network != 'livenet') address.address += ':' + network;
  }

  addSignaturesToBitcoreTx(tx, inputs, inputPaths, signatures, xpub) {
    if (signatures.length === 0) {
      throw new Error('Signatures Required');
    }

    const chain = 'DUCX';
    const unsignedTxs = tx.uncheckedSerialize();
    const signedTxs = [];

    for (let index = 0; index < signatures.length; index++) {
      const signed = Transactions.applySignature({
        chain,
        tx: unsignedTxs[index],
        signature: signatures[index]
      });
      signedTxs.push(signed);

      // bitcore users id for txid...
      tx.id = Transactions.getHash({ tx: signed, chain });
    }
    tx.uncheckedSerialize = () => signedTxs;
  }

  validateAddress(wallet, inaddr, opts) {
    const chain = 'DUCX';
    const isValidTo = Validation.validateAddress(chain, wallet.network, inaddr);

    if (!isValidTo) {
      throw Errors.INVALID_ADDRESS;
    }

    const isValidFrom = Validation.validateAddress(chain, wallet.network, opts.from);

    if (!isValidFrom) {
      throw Errors.INVALID_ADDRESS;
    }

    return;
  }
}
