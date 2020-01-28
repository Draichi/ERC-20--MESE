var Token = artifacts.require('./Token.sol')
var Sale = artifacts.require('./Sale.sol')
var tokenPrice = 1000000000000

module.exports = async function(deployer) {
  deployer.deploy(Token, 1000000).then(() => {
    return deployer.deploy(Sale, Token.address, tokenPrice)
  })
}