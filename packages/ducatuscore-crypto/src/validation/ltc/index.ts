import { IValidation } from '..';
const DucatuscoreLtc = require('@ducatus/ducatuscore-lib-ltc');

export class LtcValidation implements IValidation {
  validateAddress(network: string, address: string): boolean {
    const Address = DucatuscoreLtc.Address;
    return Address.isValid(address, network);
  }

  validateUri(addressUri: string): boolean {
    // Check if the input is a valid uri or address
    const URICash = DucatuscoreLtc.URI;
    // Bip21 uri
    return URICash.isValid(addressUri);
  }
}
