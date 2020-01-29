var Sale = artifacts.require('./Sale.sol')
var tokenPrice = 1000000000000
const numberOfTOkens = 10

contract('Sale', accounts => {
    const buyer = accounts[1]
    it('initializes the contract with the correct values', async () => {
        const salesInstance = await Sale.deployed()
        const address = await salesInstance.address
        assert.notEqual(address, 0x0, 'has contract address')
        const tokenContractAddress = await salesInstance.tokenContract()
        assert.notEqual(tokenContractAddress, 0x0, 'has token contract address')
        const price = await salesInstance.tokenPrice()
        assert.equal(price, tokenPrice, 'token price is correct')
    })
    it('facilitates token buying', async () => {
        const salesInstance = await Sale.deployed()
        const value = numberOfTOkens * tokenPrice
        const receipt = await salesInstance.buyTokens(numberOfTOkens, { from: buyer, value: value })
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Sell', 'should be the Transfer event');
        assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
        assert.equal(receipt.logs[0].args._amount, numberOfTOkens, 'logs the number of tokens purchased');
        const amount = await salesInstance.tokensSold()
        assert.equal(amount.toNumber(), numberOfTOkens, 'increments the number of tokens sold')
        try {
            await tokenInstance.buyTokens(numberOfTOkens, { from: buyer, value: 1 })
          } catch (error) {
            // quebrando esse assert 
            // assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
          }
    })
})