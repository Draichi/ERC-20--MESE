pragma solidity 0.5.8;

import './Token.sol';

contract Sale {
    constructor(Token _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    address admin;
    Token public tokenContract;
    uint256 public tokenPrice;
}