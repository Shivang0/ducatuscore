
DUCATUS P2P
=======

`ducatus-core-p2p-rev` adds [Litecoin protocol](https://en.bitcoin.it/wiki/Protocol_documentation) support for Bitcore.

See [the main litecore repo](https://github.com/litecoin-project/litecore) for more information.

## Getting Started

```sh
npm install @ducatus/ducatus-core-p2p-rev
```
In order to connect to the Ducatus network, you'll need to know the IP address of at least one node of the network, or use [Pool](/docs/pool.md) to discover peers using a DNS seed.

```javascript
var Peer = require('@ducatus/ducatus-core-p2p-rev').Peer;

var peer = new Peer({host: '127.0.0.1'});

peer.on('ready', function() {
  // peer info
  console.log(peer.version, peer.subversion, peer.bestHeight);
});
peer.on('disconnect', function() {
  console.log('connection closed');
});
peer.connect();
```

Then, you can get information from other peers by using:

```javascript
// handle events
peer.on('inv', function(message) {
  // message.inventory[]
});
peer.on('tx', function(message) {
  // message.transaction
});
```

## License

Code released under [the MIT license](https://github.com/litecoin-project/litecore/blob/master/LICENSE).
Copyright 2013-2015 BitPay, Inc. Bitcore is a trademark maintained by BitPay, Inc.
Copyright 2016 The Litecore Core Developers
