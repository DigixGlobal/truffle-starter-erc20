const LightWalletProvider = require('@digix/truffle-lightwallet-provider');

const { KEYSTORE, PASSWORD } = process.env;

if (!KEYSTORE || !PASSWORD) { throw new Error('You must export KEYSTORE and PASSWORD (see truffle.js)'); }

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 6545,
      network_id: '*',
    },
    kovan: {
      network_id: '42',
      provider: new LightWalletProvider({
        keystore: KEYSTORE,
        password: PASSWORD,
        rpcUrl: 'https://kovan.infura.io/',
        // rpcUrl: 'http://localhost:8545/',
        pollingInterval: 2000,
      }),
    },
  },
};
