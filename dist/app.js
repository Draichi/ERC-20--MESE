// var provider = new Web3.providers.HttpProvider("http://localhost:8545");
// var contract = require("@truffle/contract");

// var MyContract = contract({
//   abi: ...,
//   unlinked_binary: ...,
//   address: ..., // optional
//   // many more
// })
// MyContract.setProvider(provider);


var Web3 = require('web3');

var web3 = new Web3(Web3.currentProvider);
console.log(web3);
// > {
//     eth: ... ,
//     shh: ... ,
//     utils: ...,
//     ...
// }