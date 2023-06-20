import { Transactions, Validation } from '@ducatus/ducatuscore-crypto';
import { Web3 } from '@ducatus/ducatuscore-crypto';
import { Big } from 'big.js';
import _ from 'lodash';
import { IAddress } from 'src/lib/model/address';
import { IChain } from '..';
import { Common } from '../../common';
import { ClientError } from '../../errors/clienterror';
import logger from '../../logger';
import { ERC20Abi } from '../eth/abi-erc20';
import { InvoiceAbi } from '../eth/abi-invoice';
const { toBN } = Web3.utils;

const Constants = Common.Constants;
const Defaults = Common.Defaults;
const Errors = require('../../errors/errordefinitions');

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

const Erc20Decoder = requireUncached('abi-decoder');
Erc20Decoder.addABI(ERC20Abi);
function getErc20Decoder() {
  return Erc20Decoder;
}

const InvoiceDecoder = requireUncached('abi-decoder');
InvoiceDecoder.addABI(InvoiceAbi);
function getInvoiceDecoder() {
  return InvoiceDecoder;
}

export class DucxChain implements IChain {
  /**
   * Converts Ducatuscore Balance Response.
   * @param {Object} ducatuscoreBalance - { unconfirmed, confirmed, balance }
   * @param {Number} locked - Sum of txp.amount
   * @returns {Object} balance - Total amount & locked amount.
   */
  private convertDucatuscoreBalance(ducatuscoreBalance, locked) {
    const { confirmed, balance } = ducatuscoreBalance;
    // we ASUME all locked as confirmed, for ETH.
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

  getSizeSafetyMargin() {
    return 0;
  }

  getInputSizeSafetyMargin() {
    return 0;
  }

  notifyConfirmations() {
    return false;
  }

  supportsMultisig() {
    return false;
  }

  getWalletBalance(server, wallet, opts, cb) {
    const bc = server._getBlockchainExplorer(wallet.chain || wallet.coin, wallet.network);

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
      if (err) {
        return cb(err);
      }
      server.getPendingTxs(opts, (err, txps) => {
        if (err) return cb(err);
        // Do not lock eth multisig amount
        const lockedSum =  _.sumBy(txps, 'amount') || 0;
        const convertedBalance = this.convertDucatuscoreBalance(balance, lockedSum);
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

  getDucatuscoreTx(txp, opts = { signed: true }) {
    const { data, outputs, payProUrl, tokenAddress, tokenId } = txp;
    const isERC20 = tokenAddress && !payProUrl;
    const isERC721 = isERC20 && tokenId;

    let chain = isERC721 ? 'ERC721' : isERC20 ? 'DRC20' : 'DUCX';

    const recipients = outputs.map(output => {
      return {
        amount: output.amount,
        address: output.toAddress,
        data: output.data,
        gasLimit: output.gasLimit
      };
    });
    // Backwards compatibility DWC <= 8.9.0
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
      unsignedTxs.push(rawTx);
    }

    let tx = {
      uncheckedSerialize: () => unsignedTxs,
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

    if (opts.signed) {
      const sigs = txp.getCurrentSignatures();
      sigs.forEach(x => {
        this.addSignaturesToDucatuscoreTx(tx, txp.inputs, txp.inputPaths, x.signatures, x.xpub);
      });
    }

    return tx;
  }

  getDefaultGasLimit(opts) {
    let defaultGasLimit = opts.tokenAddress ? Defaults.DEFAULT_DRC20_GAS_LIMIT : Defaults.DEFAULT_DUCX_GAS_LIMIT;
    return defaultGasLimit;
  }

  convertFeePerKb(p, feePerKb) {
    return [p, feePerKb];
  }

  checkTx(txp) {
    try {
      const tx = this.getDucatuscoreTx(txp);
    } catch (ex) {
      logger.debug('Error building Ducatuscore transaction: %o', ex);
      return ex;
    }

    return null;
  }

  checkTxUTXOs(server, txp, opts, cb) {
    return cb();
  }

  selectTxInputs(server, txp, wallet, opts, cb) {
    server.getBalance(
      { wallet, tokenAddress: opts.tokenAddress },
      (err, balance) => {
        if (err) return cb(err);

        const { totalAmount, availableAmount } = balance;

        const txpTotalAmount = txp.getTotalAmount(opts);
        const txTotalAmountAndFee = new Big(txpTotalAmount).plus(txp.fee || 0).toNumber();
        
        if (totalAmount < txpTotalAmount) {
          return cb(Errors.INSUFFICIENT_FUNDS);
        } else if (availableAmount < txpTotalAmount) {
          return cb(Errors.LOCKED_FUNDS);
        } else {
          if (opts.tokenAddress || opts.multisigContractAddress) {
            // ETH linked wallet balance
            server.getBalance({}, (err, ethBalance) => {
              if (err) return cb(err);
              const { totalAmount, availableAmount } = ethBalance;
              if (totalAmount < txp.fee) {
                return cb(this.getInsufficientFeeError(txp));
              } else if (availableAmount < txp.fee) {
                return cb(this.getLockedFeeError(txp));
              } else {
                return cb(this.checkTx(txp));
              }
            });
          } else if (availableAmount - txp.fee < txpTotalAmount) {
            return cb(
              new ClientError(
                Errors.codes.INSUFFICIENT_FUNDS_FOR_FEE,
                `${Errors.INSUFFICIENT_FUNDS_FOR_FEE.message}. RequiredFee: ${txp.fee}`,
                {
                  requiredFee: txp.fee
                }
              )
            );
          } else {
            if (totalAmount < txTotalAmountAndFee) {
              return cb(Errors.INSUFFICIENT_FUNDS);
            } else if (availableAmount < txTotalAmountAndFee) {
              return cb(Errors.LOCKED_FUNDS);
            } else {
              return cb(this.checkTx(txp));
            }
          }
        }
      }
    );
  }

  getInsufficientFeeError(txp) {
    return new ClientError(
      Errors.codes.INSUFFICIENT_DUCX_FEE,
      `${Errors.INSUFFICIENT_DUCX_FEE.message}. RequiredFee: ${txp.fee}`,
      {
        requiredFee: txp.fee
      }
    );
  }

  getLockedFeeError(txp) {
    return new ClientError(Errors.codes.LOCKED_DUCX_FEE, `${Errors.LOCKED_DUCX_FEE.message}. RequiredFee: ${txp.fee}`, {
      requiredFee: txp.fee
    });
  }

  checkUtxos(opts) {}

  checkValidTxAmount(output): boolean {
    try {
      if (
        output.amount == null ||
        output.amount < 0 ||
        isNaN(output.amount) ||
        Web3.utils.toBN(output.amount).toString() !== output.amount.toString()
      ) {
        throw new Error('output.amount is not a valid value: ' + output.amount);
      }
      return true;
    } catch (err) {
      logger.warn(`Invalid output amount (${output.amount}) in checkValidTxAmount: $o`, err);
      return false;
    }
  }

  isUTXOChain() {
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

  addSignaturesToDucatuscoreTx(tx, inputs, inputPaths, signatures, xpub) {
    if (signatures.length === 0) {
      throw new Error('Signatures Required');
    }

    const chain = 'ETH'; // TODO use lowercase always to avoid confusion
    const unsignedTxs = tx.uncheckedSerialize();
    const signedTxs = [];
    for (let index = 0; index < signatures.length; index++) {
      const signed = Transactions.applySignature({
        chain,
        tx: unsignedTxs[index],
        signature: signatures[index]
      });
      signedTxs.push(signed);

      // ducatuscore users id for txid...
      tx.id = Transactions.getHash({ tx: signed, chain });
    }
    tx.uncheckedSerialize = () => signedTxs;
  }

  validateAddress(wallet, inaddr, opts) {
    const chain = 'ducx';
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

  onCoin(coin) {
    return null;
  }

  onTx(tx) {
    // TODO: Multisig ERC20 - Internal txs ¿?
    let tokenAddress;
    let multisigContractAddress;
    let address;
    let amount;
    if (tx.abiType && tx.abiType.type === 'DRC20') {
      tokenAddress = tx.to;
      address = Web3.utils.toChecksumAddress(tx.abiType.params[0].value);
      amount = tx.abiType.params[1].value; 
    } else {
      address = tx.to;
      amount = tx.value;
    }
    return {
      txid: tx.txid,
      out: {
        address,
        amount,
        tokenAddress,
        multisigContractAddress
      }
    };
  }
}
