import { Transactions, Validation } from '@ducatus/ducatuscore-crypto';
import _ from 'lodash';
import { Common } from '../../common';
import { ClientError } from '../../errors/clienterror';
import { EthChain } from '../eth';

const Constants = Common.Constants;
const Defaults = Common.Defaults;
const Errors = require('../../errors/errordefinitions');

export class DucxChain extends EthChain {
  /**
   * Converts Ducatuscore Balance Response.
   * @param {Object} ducatuscoreBalance - { unconfirmed, confirmed, balance }
   * @param {Number} locked - Sum of txp.amount
   * @returns {Object} balance - Total amount & locked amount.
   */

  getDucatuscoreTx(txp, opts = { signed: true }) {
    const { data, outputs, payProUrl, tokenAddress, multisigContractAddress, isTokenSwap } = txp;
    const isDRC20 = tokenAddress && !payProUrl && !isTokenSwap;
    const chain = isDRC20 ? 'DRC20' : 'DUCX';
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

  addSignaturesToDucatuscoreTx(tx, inputs, inputPaths, signatures, xpub) {
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

      // ducatuscore users id for txid...
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
    return new ClientError(
      Errors.codes.LOCKED_DUCX_FEE,
      `${Errors.LOCKED_DUCX_FEE.message}. RequiredFee: ${txp.fee}`,
      {
        requiredFee: txp.fee
      }
    );
  }
}
