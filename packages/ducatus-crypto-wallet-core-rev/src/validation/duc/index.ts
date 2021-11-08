import { IValidation } from '..';
const Ducatuscore = require('@ducatus/ducatus-core-lib-rev');

export class DucValidation implements IValidation {
  validateAddress(network: string, address: string): boolean {
    const AddressCash = Ducatuscore.Address;
    // Regular Address: try Bitcoin Cash
    return AddressCash.isValid(address, network);
  }

  validateUri(addressUri: string): boolean {
    // Check if the input is a valid uri or address
    const URI = Ducatuscore.URI;
    // Bip21 uri
    return URI.isValid(addressUri);
  }
}
