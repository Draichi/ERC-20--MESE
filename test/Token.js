var Token = artifacts.require('./Token.sol')

contract('Token', accounts => {
  it('initializes the contract with the correct values', () => {
    return Token.deployed().then(instance => {
      tokenInstance = instance
      return tokenInstance.name()
    }).then(name => {
      assert.equal(name, 'MESI', 'has the correct name')
      return tokenInstance.symbol()
    }).then(symbol => {
      assert.equal(symbol, 'MESI', 'has the correct symbol')

    })
  })
  it('sets the total supply upon development', () => {
    return Token.deployed().then(instance => {
      tokenInstance = instance
      return tokenInstance.totalSupply()
    }).then(totalSupply => {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to')
      return tokenInstance.balanceOf(accounts[0])
    }).then(adminBalance => {
      assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin')
    })
  })
  it('transfers token ownership', () => {
    return Token.deployed().then(instance => {
      tokenInstance = instance
      return tokenInstance.transfer.call(accounts[1], 999999999999999)
    }).then(assert.fail).catch(error => {
      assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
      return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] })
    }).then(success => {
      assert.equal(success, true, 'it returns true')
      return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] })
    }).then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to');
      assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
      return tokenInstance.balanceOf(accounts[1])

    }).then(balance => {
      assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account')
      return tokenInstance.balanceOf(accounts[0])
    }).then(balance => {
      assert.equal(balance.toNumber(), 750000, 'deducs the amount from the sending account')
    })
  });
  it('approves tokens for delegated transfers', async () => {
    const tokenInstance = await Token.deployed()
    const success = await tokenInstance.approve.call(accounts[1], 100);
    assert.equal(success, false)
  });
})