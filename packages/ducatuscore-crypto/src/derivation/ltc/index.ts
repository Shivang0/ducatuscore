const DucatuscoreLibLtc = require('@ducatus/ducatuscore-lib-ltc');
import { AbstractDucatuscoreLibDeriver } from '../btc';
export class LtcDeriver extends AbstractDucatuscoreLibDeriver {
  ducatuscoreLib = DucatuscoreLibLtc;
}
