import * as _ from 'lodash';
import { homedir } from 'os';
import { ConfigType } from './types/Config';

export function getNodeConfig(): ConfigType | undefined {
  const configFileName = 'ducatuscore.config.json';
  let ducatuscoreConfigPaths = [
    `${homedir()}/${configFileName}`,
    `../../../../../${configFileName}`,
    `../../${configFileName}`
  ];

  // No config specified. Search home, ducatuscore and cur directory
  let foundConfig;
  for (let path of ducatuscoreConfigPaths) {
    if (!foundConfig) {
      try {
        const expanded = path[0] === '~' ? path.replace('~', homedir()) : path;
        const ducatuscoreConfig = require(expanded) as { ducatuscoreNode: ConfigType };
        foundConfig = ducatuscoreConfig.ducatuscoreNode;
      } catch (e) {
        foundConfig = undefined;
      }
    }
  }
  return foundConfig;
}
