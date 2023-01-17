import { ethers } from 'hardhat';

async function main() {
  const deployer = (await ethers.getSigners())[0];

  const transactionCount = await deployer.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: transactionCount + 1,
  });

  const MyGovernor = await ethers.getContractFactory('MyGovernor');
  const governor = await MyGovernor.deploy(futureAddress);

  const MyToken = await ethers.getContractFactory('MyToken');
  const token = await MyToken.deploy(governor.address);

  console.log(
    `Governor deployed to ${governor.address}`,
    `Token deployed to ${token.address}`
  );
}

main()
  .then(() => {
    console.log('Deployment is finished!');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
