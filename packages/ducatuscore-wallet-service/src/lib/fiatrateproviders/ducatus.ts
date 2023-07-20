import _ from 'lodash';

module.exports = {
  name: 'Ducatus',
  url:
   process.env.MODE === 'prod'
      ? 'https://rates.ducatuscoins.com/api/v1/rates/'
      : 'https://ducexpl.rocknblock.io/api/v1/rates/',
  parseFn(raw, coin) {
    coin = coin.toUpperCase();
    
    if (!raw[coin]) {
      return undefined;
    }
        
    const rates: any[] = []

    for (let key in raw[coin]) {
      rates.push({
        code: key,
        value: Number(raw[coin][key])
      });
    }

    return rates;
  }
};
