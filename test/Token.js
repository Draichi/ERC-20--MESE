var Token = artifacts.require('./Token.sol')

contract('Token', accounts => {
  it('sets the total supply upon development', () => {
    return Token.deployed().then(instance => {
      tokenInstance = instance
      return tokenInstance.totalSupply()
    }).then(totalSupply => {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to')
    })
  })
})