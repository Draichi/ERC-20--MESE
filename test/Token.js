var Token = artifacts.require('./Token.sol')

contract('Token', accounts => {
  it('initializes the contract with the correct values', async () => {
    const tokenInstance = await Token.deployed()
    const name = await tokenInstance.name()
    const symbol = await tokenInstance.symbol()
    const totalSupply = await tokenInstance.totalSupply()
    const adminBalance = await tokenInstance.balanceOf(accounts[0])
    assert.equal(name, 'MESI', 'has the correct name')
    assert.equal(symbol, 'MESI', 'has the correct symbol')
    assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1000000')
    assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin')
  })
  it('transfers token ownership', async () => {
    const tokenInstance = await Token.deployed()
    const success = await tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] })
    assert.equal(success, true, 'it returns true')
    const receipt = await tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] })
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer event');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to');
    assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
    const balanceReceiver = await tokenInstance.balanceOf(accounts[1])
    assert.equal(balanceReceiver.toNumber(), 250000, 'adds the amount to the receiving account')
    const balanceSender = await tokenInstance.balanceOf(accounts[0])
    assert.equal(balanceSender.toNumber(), 750000, 'deducs the amount from the sending account')
    try {
      await tokenInstance.transfer.call(accounts[1], 999999999999999)
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
    }
  });
  it('approves tokens for delegated transfers', async () => {
    const tokenInstance = await Token.deployed()
    const success = await tokenInstance.approve.call(accounts[1], 100);
    assert.equal(success, true)
    const receipt = await tokenInstance.approve(accounts[1], 100)
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approval event');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are transfered by');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are transfered to');
    assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
  });
})