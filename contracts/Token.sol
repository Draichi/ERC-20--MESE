pragma solidity ^0.5.8;

contract Token {
    string public name = "MESI";
    string public symbol = "MESI";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );
    mapping (address=>uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public returns (bool success) {
        emit Approve(msg.sender, _spender, _value);
        return true;
    }
}