'use strict';

var ducatuscore = module.exports;

// module information
ducatuscore.version = 'v' + require('./package.json').version;
ducatuscore.versionGuard = function(version) {
  if (version !== undefined) {
    var message = 'More than one instance of ducatuscore-lib-cash found. ' +
      'Please make sure to require ducatuscore-lib and check that submodules do' +
      ' not also include their own ducatuscore-lib dependency.';
    throw new Error(message);
  }
};
ducatuscore.versionGuard(global._ducatuscoreCash);
global._ducatuscoreCash = ducatuscore.version;

// crypto
ducatuscore.crypto = {};
ducatuscore.crypto.BN = require('./lib/crypto/bn');
ducatuscore.crypto.ECDSA = require('./lib/crypto/ecdsa');
ducatuscore.crypto.Schnorr = require('./lib/crypto/schnorr');
ducatuscore.crypto.Hash = require('./lib/crypto/hash');
ducatuscore.crypto.Random = require('./lib/crypto/random');
ducatuscore.crypto.Point = require('./lib/crypto/point');
ducatuscore.crypto.Signature = require('./lib/crypto/signature');

// encoding
ducatuscore.encoding = {};
ducatuscore.encoding.Base58 = require('./lib/encoding/base58');
ducatuscore.encoding.Base58Check = require('./lib/encoding/base58check');
ducatuscore.encoding.BufferReader = require('./lib/encoding/bufferreader');
ducatuscore.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
ducatuscore.encoding.Varint = require('./lib/encoding/varint');

// utilities
ducatuscore.util = {};
ducatuscore.util.buffer = require('./lib/util/buffer');
ducatuscore.util.js = require('./lib/util/js');
ducatuscore.util.preconditions = require('./lib/util/preconditions');
ducatuscore.util.base32 = require('./lib/util/base32');
ducatuscore.util.convertBits = require('./lib/util/convertBits');

// errors thrown by the library
ducatuscore.errors = require('./lib/errors');

// main bitcoin library
ducatuscore.Address = require('./lib/address');
ducatuscore.Block = require('./lib/block');
ducatuscore.MerkleBlock = require('./lib/block/merkleblock');
ducatuscore.BlockHeader = require('./lib/block/blockheader');
ducatuscore.HDPrivateKey = require('./lib/hdprivatekey.js');
ducatuscore.HDPublicKey = require('./lib/hdpublickey.js');
ducatuscore.Networks = require('./lib/networks');
ducatuscore.Opcode = require('./lib/opcode');
ducatuscore.PrivateKey = require('./lib/privatekey');
ducatuscore.PublicKey = require('./lib/publickey');
ducatuscore.Script = require('./lib/script');
ducatuscore.Transaction = require('./lib/transaction');
ducatuscore.URI = require('./lib/uri');
ducatuscore.Unit = require('./lib/unit');

// dependencies, subject to change
ducatuscore.deps = {};
ducatuscore.deps.bnjs = require('bn.js');
ducatuscore.deps.bs58 = require('bs58');
ducatuscore.deps.Buffer = Buffer;
ducatuscore.deps.elliptic = require('elliptic');
ducatuscore.deps._ = require('lodash');

// Internal usage, exposed for testing/advanced tweaking
ducatuscore.Transaction.sighash = require('./lib/transaction/sighash');
