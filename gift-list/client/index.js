const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  // TODO: how do we prove to the server we're on the nice list?

  try {
    const { data: gift, error } = await axios.post(`${serverUrl}/gift`, {
      name: 'Sidney Kertzmann',
    });
    console.log(gift);
  } catch (err) {
    console.error(`Error!\nMessage: ${err.message}`);
    process.exit(1);
  }
}

main();
