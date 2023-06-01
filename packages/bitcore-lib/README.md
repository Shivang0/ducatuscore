# Ducatuscore JavaScript Library for Ducatuscore

**A pure and powerful JavaScript library for Ducatuscore.**

## Principles

Ducatuscore is a powerful new peer-to-peer platform for the next generation of financial technology. The decentralized nature of the Ducatuscore network allows for highly resilient ducatuscore infrastructure, and the developer community needs reliable, open-source tools to implement ducatuscore apps and services. Ducatuscore JavaScript Library provides a reliable API for JavaScript apps that need to interface with Ducatuscore.

## Get Started

Clone the Ducatuscore monorepo and `npm install`:

## Building the Browser Bundle


To build a ducatuscore-lib full bundle for the browser:

```sh
gulp browser
```

This will generate files named `ducatuscore-lib.js` and `ducatuscore-lib.min.js`.

## Running Tests

```sh
npm test
```

You can also run just the Node.js tests with `gulp test:node`, just the browser tests with `gulp test:browser` or create a test coverage report (you can open `coverage/lcov-report/index.html` to visualize it) with `gulp coverage`.

## Documentation 

### Addresses and Key Management

- [Addresses](docs/address.md)
- [Using Different Networks](docs/networks.md)
- [Private Keys](docs/privatekey.md) and [Public Keys](docs/publickey.md)
- [Hierarchically-derived Private and Public Keys](docs/hierarchical.md)

### Payment Handling

- [Using Different Units](docs/unit.md)
- [Acknowledging and Requesting Payments: Bitcoin URIs](docs/uri.md)
- [The Transaction Class](docs/transaction.md)
- [Unspent Transaction Output Class](docs/unspentoutput.md)

### Bitcoin Internals

- [Scripts](docs/script.md)
- [Block](docs/block.md)

### Extra

- [Crypto](docs/crypto.md)
- [Encoding](docs/encoding.md)

### Module Development

- [Browser Builds](docs/browser.md)

### Modules

Some functionality is implemented as a module that can be installed separately:

- [Peer to Peer Networking](../ducatuscore-p2p)
- [Bitcoin Core JSON-RPC](https://github.com/bitpay/bitcoind-rpc)
- [Payment Channels](https://github.com/bitpay/bitcore-channel)
- [Mnemonics](../ducatuscore-mnemonic)
- [Elliptical Curve Integrated Encryption Scheme](https://github.com/bitpay/bitcore-ecies)
- [Blockchain Explorers](https://github.com/bitpay/bitcore-explorers)
- [Signed Messages](https://github.com/bitpay/bitcore-message)

## Examples

- [Generate a random address](docs/examples.md#generate-a-random-address)
- [Generate a address from a SHA256 hash](docs/examples.md#generate-a-address-from-a-sha256-hash)
- [Import an address via WIF](docs/examples.md#import-an-address-via-wif)
- [Create a Transaction](docs/examples.md#create-a-transaction)
- [Sign a Bitcoin message](docs/examples.md#sign-a-bitcoin-message)
- [Verify a Bitcoin message](docs/examples.md#verify-a-bitcoin-message)
- [Create an OP RETURN transaction](docs/examples.md#create-an-op-return-transaction)
- [Create a 2-of-3 multisig P2SH address](docs/examples.md#create-a-2-of-3-multisig-p2sh-address)
- [Spend from a 2-of-2 multisig P2SH address](docs/examples.md#spend-from-a-2-of-2-multisig-p2sh-address)

## Security

We're using the Ducatuscore JavaScript Library in production, as are many others, but please use common sense when doing anything related to finances! We take no responsibility for your implementation decisions.