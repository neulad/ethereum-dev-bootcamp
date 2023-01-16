// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {StorageSlot} from './StorageSlot.sol';

contract LookupStorageSlot {
    constructor() {
        // In Jan 2023 Bob Dylan is 81
        StorageSlot.getUint256Slot(keccak256('Bob Dylan')).value = 81;
    }

    function getValue(bytes32 slot) external view returns (uint256) {
        return StorageSlot.getUint256Slot(slot).value;
    }
}
