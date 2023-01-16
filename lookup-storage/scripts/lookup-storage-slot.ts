import { deployments, ethers } from 'hardhat';
import { LookupStorageSlot } from '../typechain-types';

async function main() {
  await deployments.fixture(['lookup-sotrage-slot']);
  const lookupStorageSlot = await ethers.getContract<LookupStorageSlot>(
    'LookupStorageSlot'
  );

  const storageSlot = await ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('Bob Dylan')
  );
  const valueAtSlot = await ethers.provider.getStorageAt(
    lookupStorageSlot.address,
    storageSlot
  );
  console.log(
    `Retrived value from slot ${storageSlot}: ${parseInt(valueAtSlot)}`
  );

  const valueViaFunction = await lookupStorageSlot.getValue(storageSlot);
  console.log(
    `Retrived value from slot via function ${storageSlot}: ${valueViaFunction.toString()}`
  );
}

main()
  .then(() => {
    console.log('Lookup on the storage slot is finished!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
