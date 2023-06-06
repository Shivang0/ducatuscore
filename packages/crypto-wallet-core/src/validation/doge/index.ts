import { IValidation } from '..';
const DucatuscoreDoge = require('@ducatus/ducatuscore-lib-doge');

export class DogeValidation implements IValidation {
  validateAddress(network: string, address: string): boolean {
    const Address = DucatuscoreDoge.Address;
    return Address.isValid(address, network);
  }

  validateUri(addressUri: string): boolean {
    // Check if the input is a valid uri or address
    const URICash = DucatuscoreDoge.URI;
    // Bip21 uri
    return URICash.isValid(addressUri);
  }
}
