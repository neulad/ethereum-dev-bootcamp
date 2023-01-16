import { deployments, ethers } from 'hardhat';

async function main() {
  await deployments.fixture(['lookup']);
  const lookup = await ethers.getContract('Lookup');

  const storageAt = 0x2;
  const valueAtStorage = await ethers.provider.getStorageAt(
    lookup.address,
    storageAt
  );
  console.log(`Retrieved uint256 value at ${storageAt}: ${valueAtStorage}`);

  const mappingBaseSlot = ethers.utils.hexZeroPad('0x6', 32).slice(2);
  const mappingKey = ethers.utils.hexZeroPad('0x2c', 32);
  const mappingStorageAt = ethers.utils.keccak256(mappingKey + mappingBaseSlot);
  const mappingValue = await ethers.provider.getStorageAt(
    lookup.address,
    mappingStorageAt
  );
  console.log(
    `Retrieved mapping value at ${mappingStorageAt}: ${mappingValue}`
  );
}

main()
  .then(() => {
    console.log('Lookup is finished!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
  });
