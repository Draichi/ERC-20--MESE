pragma solidity ^0.5.8;

contract Token {

    uint256 public totalSupply;

    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
    }
}