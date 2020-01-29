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

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'safe multiply');
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice), 'require that value is equal to tokens');
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }
}