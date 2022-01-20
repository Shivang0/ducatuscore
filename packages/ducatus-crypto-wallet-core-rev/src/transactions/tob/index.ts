import Web3 from 'web3';
import { DUCXTxProvider } from '../ducx';
import abi from './abi';

export class TransferDUCXToWDUCXProvider extends DUCXTxProvider {
  getERC20Contract(tokenAddress) {
    const web3 = new Web3();
    const contract = new web3.eth.Contract(abi, tokenAddress);
    return contract;
  }

  create(params) {
    const { tokenAddress } = params;
    const data = this.encodeData(params);
    const recipients = [{ address: tokenAddress, amount: params.amount }];
    const newParams = { ...params, recipients, data };
    return super.create(newParams);
  }

  encodeData(params) {
    const data = this.getERC20Contract(params.tokenAddress)
      .methods.transferToOtherBlockchain(1, params.wDucxAddress)
      .encodeABI();
    return data;
  }
}
