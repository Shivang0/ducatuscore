module.exports = {
  name: 'Bitstamp',
  url: 'https://www.bitstamp.net/api/ticker/',
  parseFn(raw, coin) {
    return [
      {
        code: 'USD',
        value: parseFloat(raw.last)
      }
    ];
  }
};
