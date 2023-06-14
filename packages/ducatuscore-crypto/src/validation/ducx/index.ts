import { EthValidation } from '../eth';
const utils = require('web3-utils');

export class DucxValidation extends EthValidation {
  validateUri(addressUri: string): boolean {
    if (!addressUri) {
      return false;
    }
    const address = this.extractAddress(addressUri);
    const ducxPrefix = /ducx/i.exec(addressUri);
    return !!ducxPrefix && utils.isAddress(address);
  }

  protected extractAddress(data) {
    const prefix = /^[a-z]+:/i;
    const params = /([\?\&](value|gas|gasPrice|gasLimit)=(\d+([\,\.]\d+)?))+/i;
    return data.replace(prefix, '').replace(params, '');
  }
}
