'use strict';

var ducatuscoreLibDuc = module.exports;

// module information
ducatuscoreLibDuc.version = 'v' + require('./package.json').version;
ducatuscoreLibDuc.versionGuard = function(version) {
  if (version !== undefined) {
    var message = 'More than one instance of ducatuscore-lib-duc found. ' +
      'Please make sure to require ducatuscore-lib-duc and check that submodules do' +
      ' not also include their own ducatuscore-lib-duc dependency.';
    throw new Error(message);
  }
};
ducatuscoreLibDuc.versionGuard(global._ducatuscoreLibDuc);
global._ducatuscoreLibDuc = ducatuscoreLibDuc.version;

// crypto
ducatuscoreLibDuc.crypto = {};
ducatuscoreLibDuc.crypto.BN = require('./lib/crypto/bn');
ducatuscoreLibDuc.crypto.ECDSA = require('./lib/crypto/ecdsa');
ducatuscoreLibDuc.crypto.Hash = require('./lib/crypto/hash');
ducatuscoreLibDuc.crypto.Random = require('./lib/crypto/random');
ducatuscoreLibDuc.crypto.Point = require('./lib/crypto/point');
ducatuscoreLibDuc.crypto.Signature = require('./lib/crypto/signature');

// encoding
ducatuscoreLibDuc.encoding = {};
ducatuscoreLibDuc.encoding.Base58 = require('./lib/encoding/base58');
ducatuscoreLibDuc.encoding.Base58Check = require('./lib/encoding/base58check');
ducatuscoreLibDuc.encoding.BufferReader = require('./lib/encoding/bufferreader');
ducatuscoreLibDuc.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
ducatuscoreLibDuc.encoding.Varint = require('./lib/encoding/varint');

// utilities
ducatuscoreLibDuc.util = {};
ducatuscoreLibDuc.util.buffer = require('./lib/util/buffer');
ducatuscoreLibDuc.util.js = require('./lib/util/js');
ducatuscoreLibDuc.util.preconditions = require('./lib/util/preconditions');

// errors thrown by the library
ducatuscoreLibDuc.errors = require('./lib/errors');

// main bitcoin library
ducatuscoreLibDuc.Address = require('./lib/address');
ducatuscoreLibDuc.Block = require('./lib/block');
ducatuscoreLibDuc.MerkleBlock = require('./lib/block/merkleblock');
ducatuscoreLibDuc.BlockHeader = require('./lib/block/blockheader');
ducatuscoreLibDuc.HDPrivateKey = require('./lib/hdprivatekey.js');
ducatuscoreLibDuc.HDPublicKey = require('./lib/hdpublickey.js');
ducatuscoreLibDuc.Message = require('./lib/message');
ducatuscoreLibDuc.Networks = require('./lib/networks');
ducatuscoreLibDuc.Opcode = require('./lib/opcode');
ducatuscoreLibDuc.PrivateKey = require('./lib/privatekey');
ducatuscoreLibDuc.PublicKey = require('./lib/publickey');
ducatuscoreLibDuc.Script = require('./lib/script');
ducatuscoreLibDuc.Transaction = require('./lib/transaction');
ducatuscoreLibDuc.URI = require('./lib/uri');
ducatuscoreLibDuc.Unit = require('./lib/unit');

// dependencies, subject to change
ducatuscoreLibDuc.deps = {};
ducatuscoreLibDuc.deps.bnjs = require('bn.js');
ducatuscoreLibDuc.deps.bs58 = require('bs58');
ducatuscoreLibDuc.deps.Buffer = Buffer;
ducatuscoreLibDuc.deps.elliptic = require('elliptic');
ducatuscoreLibDuc.deps._ = require('lodash');

// Internal usage, exposed for testing/advanced tweaking
ducatuscoreLibDuc.Transaction.sighash = require('./lib/transaction/sighash');
