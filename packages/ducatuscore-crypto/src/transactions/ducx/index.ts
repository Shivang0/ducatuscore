import { ethers } from 'ethers';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Key } from '../../derivation';
import { ERC20Abi } from '../erc20/abi';
const utils = require('web3-utils');
const { toBN } = Web3.utils;

export class DUCXTxProvider {
  create(params: {
    recipients: Array<{ address: string; amount: string }>;
    nonce: number;
    gasPrice: number;
    data: string;
    gasLimit: number;
    network: string;
    chainId?: number;
    contractAddress?: string;
    tokenAddress?: string;
    tokenId?: number;
  }) {
    switch (params.network) {
      case 'testnet':
        params.chainId = 0x6772;
        break;
      case 'livenet':
      case 'mainnet':
        params.chainId = 0x6773;
        break;
    }
    
    const { recipients, nonce, gasPrice, data, gasLimit, chainId = 0x6773 } = params;
    const { address, amount } = recipients[0];

    const txData = {
      nonce: utils.toHex(nonce),
      gasLimit: utils.toHex(gasLimit),
      gasPrice: utils.toHex(gasPrice),
      to: address,
      data,
      // bn.js error
      // necessary transform 1e21 to 1000000000000000000000
      value: utils.toHex(Number(amount).toLocaleString('fullwide', { useGrouping: false })),
      chainId
    };
    return ethers.utils.serializeTransaction(txData);
  }

  getSignatureObject(params: { tx: string; key: Key }) {
    const { tx, key } = params;
    // To complain with new ethers
    let k = key.privKey;
    if (k.substr(0, 2) != '0x') {
      k = '0x' + k;
    }

    const signingKey = new ethers.utils.SigningKey(k);
    const signDigest = signingKey.signDigest.bind(signingKey);
    return signDigest(ethers.utils.keccak256(tx));
  }

  getSignature(params: { tx: string; key: Key }) {
    const signatureHex = ethers.utils.joinSignature(this.getSignatureObject(params));
    return signatureHex;
  }

  getHash(params: { tx: string }) {
    const { tx } = params;
    // tx must be signed, for hash to exist
    return ethers.utils.parseTransaction(tx).hash;
  }

  applySignature(params: { tx: string; signature: any }) {
    let { tx, signature } = params;
    const parsedTx = ethers.utils.parseTransaction(tx);
    const { nonce, gasPrice, gasLimit, to, value, data, chainId } = parsedTx;
    const txData = { nonce, gasPrice, gasLimit, to, value, data, chainId };
    if (typeof signature == 'string') {
      signature = ethers.utils.splitSignature(signature);
    }
    const signedTx = ethers.utils.serializeTransaction(txData, signature);
    const parsedTxSigned = ethers.utils.parseTransaction(signedTx);
    if (!parsedTxSigned.hash) {
      throw new Error('Signature invalid');
    }
    return signedTx;
  }

  sign(params: { tx: string; key: Key }) {
    const { tx, key } = params;
    const signature = this.getSignatureObject({ tx, key });
    return this.applySignature({ tx, signature });
  }
}
