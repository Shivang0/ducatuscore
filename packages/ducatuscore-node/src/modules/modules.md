# Modules
Modules are loaded before services are started. This allows code to hook into services and register classes, event handlers, etc that alter the behaviors of services.

## Known Modules
The modules in this table will automatically register with `ducatuscore-node` if your `ducatuscore.config.json` contains a valid configuration for their respective chains.

| Chain          | Module         | Module Path (Relative to ModuleManager) |
| -------------- | -------------- | -------------- |
| BTC            | bitcoin        | ./bitcoin      |
| ETH            | ethereum       | ./ethereum     |
| BCH            | bitcoin-cash   | ./bitcoin-cash |
| XRP            | ripple         | ./ripple       |

If there is a custom or third-party module you'd like to use, follow the example below.

## Example - Syncing BCH
Let's say we have a node_module, named `ducatuscore-node-bch` with the following code

```
// index.js

module.exports = class BitcoinCashModule {
  constructor(services) {
    services.Libs.register('BCH', 'ducatuscore-lib-cash', 'ducatuscore-p2p-cash');
    services.P2P.register('BCH', services.P2P.get('BTC'));
  }
}
```

The module has the following dependencies
```
// package.json

  "dependencies": {
    "ducatuscore-lib-cash": "^8.3.4",
    "ducatuscore-p2p-cash": "^8.3.4"
  }

```

We could add this module by adding `ducatuscore-node-bch` to the modules array in ducatuscore.config.json

```
    modules: ['./bitcoin', 'ducatuscore-node-bch'],
```
