// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFSStorage {
    string private ipfsHash;

    // Store the IPFS hash
    function setIPFSHash(string memory _ipfsHash) public {
        ipfsHash = _ipfsHash;
    }

    // Retrieve the IPFS hash
    function getIPFSHash() public view returns (string memory) {
        return ipfsHash;
    }
}