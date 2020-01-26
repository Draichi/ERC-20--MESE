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
    const receipt = await tokenInstance.approve(accounts[1], 100, { from: accounts[0] })
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approval event');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are transfered by');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are transfered to');
    assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
    const allowance = await tokenInstance.allowance(accounts[0], accounts[1])
    assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer')
  });
  it('handles delegated token transfers', async () => {
    const tokenInstance = await Token.deployed()
    const fromAccount = accounts[2]
    const toAccount = accounts[3]
    const spendingAccount = accounts[4]
    // transfer some tokens to fromAccount
    await tokenInstance.transfer(fromAccount, 100, { from: accounts[0] })
    await tokenInstance.approve(spendingAccount, 10, { from: fromAccount })
    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount })
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance')
    }
    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 11, { from: spendingAccount })
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved')
    }
    const success = await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount })
    assert.equal(success, true)
    const receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount })
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer event');
    assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transfered by');
    assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transfered to');
    assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
    const balanceFrom = await tokenInstance.balanceOf(fromAccount)
    assert.equal(balanceFrom.toNumber(), 90, 'deducts the amount from the sending account')
    const balanceTo = await tokenInstance.balanceOf(toAccount)
    assert.equal(balanceTo.toNumber(), 10, 'adds the amount from the receiving account')
    const allowance = await tokenInstance.allowance(fromAccount, spendingAccount)
    assert.equal(allowance, 0, 'deducts the amount from the allowance')
  })
})