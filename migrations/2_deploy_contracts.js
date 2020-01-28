var Token = artifacts.require('./Token.sol')
var Sale = artifacts.require('./Sale.sol')
var tokenPrice = 1000000000000

module.exports = function(deployer) {
  deployer.deploy(Token, 1000000)
  deployer.deploy(Sale, Token.address, tokenPrice)
}