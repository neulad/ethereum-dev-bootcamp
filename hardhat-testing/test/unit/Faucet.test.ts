import { ethers, deployments } from 'hardhat';
import { expect } from 'chai';
import { Faucet } from '../../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/src/signers';

describe('Faucet', function () {
  let faucet: Faucet;
  let deployer: any;

  beforeEach(async function () {
    await deployments.fixture(['all']);
    faucet = await ethers.getContract('Faucet');
    deployer = (await ethers.getSigners())[0];
  });

  describe('destroyFaucet()', function () {
    it('reverts because not owner', async function () {
      const attacker = (await ethers.getSigners())[1];
      const attackerFaucet = faucet.connect(attacker);
      await expect(attackerFaucet.destroyFaucet()).to.be.rejected;
    });

    it('destructs the contract', async function () {
      const faucetAddress = faucet.address;
      await faucet.destroyFaucet();

      expect(await ethers.provider.getCode(faucetAddress)).to.be.equal('0x');
    });
  });

  describe('withdrawAll()', function () {
    it('reverts because not owner', async function () {
      const attacker = (await ethers.getSigners())[1];
      const attackerFaucet = faucet.connect(attacker);
      await expect(attackerFaucet.withdrawAll()).to.be.rejected;
    });

    it('returns balance', async function () {
      await deployer.sendTransaction({
        to: faucet.address,
        value: ethers.utils.parseEther('1.0'),
      });
      const initialBalance = await ethers.provider.getBalance(deployer.address);

      const txRec = await faucet.withdrawAll();
      const txRes = await txRec.wait();
      const totalGas = txRes.gasUsed.mul(txRes.effectiveGasPrice);
      const finalBalance = await ethers.provider.getBalance(deployer.address);

      expect(finalBalance).to.be.equal(
        initialBalance.add(ethers.utils.parseEther('1.0')).sub(totalGas)
      );
    });
  });
});
