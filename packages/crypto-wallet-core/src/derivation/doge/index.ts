const DucatuscoreLibDoge = require('@ducatus/ducatuscore-lib-doge');
import { AbstractDucatuscoreLibDeriver } from '../btc';
export class DogeDeriver extends AbstractDucatuscoreLibDeriver {
  ducatuscoreLib = DucatuscoreLibDoge;
}
