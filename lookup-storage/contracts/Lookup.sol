// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Lookup {
    uint256 storage0x0 = 0;
    uint256 storage0x1 = 1;
    uint256 storage0x2 = 2;
    uint256 storage0x3 = 3;
    uint256 storage0x4 = 3;
    uint256 storage0x5 = 5;
    mapping(uint256 => uint256) complexStorage;

    constructor() {
        complexStorage[3] = 3;
        complexStorage[44] = 44;
    }
}
