pragma solidity 0.5.8;

import './Token.sol';

contract Sale {
    constructor(Token _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    event Sell(address _buyer, uint256 _amount);

    address admin;
    Token public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    function buyTokens(uint256 _numberOfTokens) public payable {
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }
}