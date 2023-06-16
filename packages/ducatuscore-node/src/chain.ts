module.exports = {
  BTC: {
    lib: require('@ducatus/ducatuscore-lib'),
    p2p: require('@ducatus/ducatuscore-p2p')
  },
  BCH: {
    lib: require('@ducatus/ducatuscore-lib-cash'),
    p2p: require('@ducatus/ducatuscore-p2p-cash')
  },
  DUC: {
    lib: require('@ducatus/ducatuscore-lib-duc'),
    p2p: require('@ducatus/ducatuscore-p2p-duc')
  }
};
