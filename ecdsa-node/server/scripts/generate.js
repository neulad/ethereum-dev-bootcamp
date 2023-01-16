const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');

const privKey = secp.utils.randomPrivateKey();

console.log(`Private: ${toHex(privKey)}`);

const pubKey = secp.getPublicKey(privKey);

console.log(`Public: ${toHex(pubKey)}`);
