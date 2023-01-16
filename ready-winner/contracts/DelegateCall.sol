//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract DelegateCall {
    address private immutable i_winnerAddress;

    constructor(address winnerAddress) {
        i_winnerAddress = winnerAddress;
    }

    function callAttempt() external {
        (bool success, ) = i_winnerAddress.call(
            abi.encodeWithSignature("attempt()")
        );

        if (!success) revert("Function is not called!");
    }
}
