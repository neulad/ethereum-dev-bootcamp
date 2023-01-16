import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/dist/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  await deploy('DelegateCall', {
    from: deployer,
    log: true,
    args: ['0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502'],
  });
};

export default func;
func.tags = ['all', 'delegate-call'];
