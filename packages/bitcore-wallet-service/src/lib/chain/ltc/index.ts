import { DucatuscoreLibLtc } from '@ducatus/ducatuscore-crypto';
import _ from 'lodash';
import { IChain } from '..';
import { BtcChain } from '../btc';

export class LtcChain extends BtcChain implements IChain {
  constructor() {
    super(DucatuscoreLibLtc);
  }
}
