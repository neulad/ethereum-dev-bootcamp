import { ethers } from 'hardhat';
import { DelegateCall } from '../typechain-types';

async function main() {
  const delegateCall = await ethers.getContract<DelegateCall>('DelegateCall');

  const txRec = await delegateCall.callAttempt();
  const txRes = await txRec.wait(1);
  console.log(txRes.transactionHash);
}

main()
  .then(() => {
    console.log('Delegated call successfully 🥳!');
    process.exit(0);
  })
  .catch(err => {
    console.error("Didn't delegate the call 😕\n");
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
