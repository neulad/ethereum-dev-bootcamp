import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';
import Transaction from './Transaction';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [txs, setTxs] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
      const blockHash = (await alchemy.core.getBlock()).hash;
      const rawTxs = (await alchemy.core.getBlockWithTransactions(blockHash))
        .transactions.length;
      setTxs(rawTxs);
    }

    getBlockNumber();
  });

  return (
    <div>
      <div className="App">Block Number: {blockNumber}</div>
      <div className="App">Transactions Number: {txs}</div>
    </div>
  );
}

export default App;
