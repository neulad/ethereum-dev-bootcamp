const { ethers, upgrades } = require('hardhat');

const proxyAddress = '0x8b3D7aF3BC28a03fC284eDb560FC97edFD521CB2';

async function main() {
  const VendingMachineV2 = await ethers.getContractFactory('VendingMachineV2');
  const upgraded = await upgrades.upgradeProxy(proxyAddress, VendingMachineV2);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log('The current contract owner is: ' + upgraded.owner());
  console.log('Implementation contract address: ' + implementationAddress);
}

main()
  .then(() => {
    console.log('Upgraded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
