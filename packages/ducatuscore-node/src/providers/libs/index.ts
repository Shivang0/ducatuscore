class LibProvider {
  libs = {
    BTC: {
      lib: require('@ducatus/ducatuscore-lib'),
      p2p: require('@ducatus/ducatuscore-p2p')
    },
    DUC: {
      lib: require('@ducatus/ducatuscore-lib-duc'),
      p2p: require('@ducatus/ducatuscore-p2p-duc')
    }
  };

  register(chain: string, lib: string, p2p: string) {
    this.libs[chain] = { lib: require(lib), p2p: require(p2p) };
  }

  get(chain) {
    return this.libs[chain];
  }
}

export const Libs = new LibProvider();
