// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract VendingMachineV1 is Initializable {
    // these state variables and their values
    // will be preserved forever, regardless of upgrading
    uint256 private s_numSodas;
    address private s_owner;

    function initialize(uint _numSodas) public initializer {
        s_numSodas = _numSodas;
        s_owner = msg.sender;
    }

    function purchaseSoda() public payable {
        require(msg.value >= 1000 wei, 'You must pay 1000 wei for a soda!');
        s_numSodas--;
    }

    function getNumSodas() external view returns (uint256) {
        return s_numSodas;
    }

    function getOwner() external view returns (address) {
        return s_owner;
    }
}
