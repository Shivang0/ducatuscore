'use strict';

var spec = {
  name: 'P2P',
  message: 'Internal Error on ducatuscore-p2p Module {0}'
};

module.exports = require('@ducatus/ducatuscore-lib').errors.extend(spec);
