var Sale = artifacts.require('./Sale.sol')
var tokenPrice = 1000000000000

contract('Sale', accounts => {
    it('initializes the contract with the correct values', async () => {
        const salesInstance = await Sale.deployed()
        const address = await salesInstance.address
        assert.notEqual(address, 0x0, 'has contract address')
        const tokenContractAddress = await salesInstance.tokenContract()
        assert.notEqual(tokenContractAddress, 0x0, 'has token contract address')
        const price = await salesInstance.tokenPrice()
        assert.equal(price, tokenPrice, 'token price is correct')
    })
})