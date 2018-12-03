const eth_helper = require('./libs/eth-helper');
const eos_helper = require('./libs/eos-helper');

///////////////// Sending Ethereum ///////////////////////////
// let transactionId = eth_helper.sendEth(
//     '0x8D9Cb689A3c275D98737F191FbE0baB717400175',
//     'b28f8812c815255a6393a45d82d26d374fa4afbad629c7330a910a342f1e7232',
//     '0x376d3306288831F63546E31F518d8b40517a5ca1',
//     0.1
// );

// const url = `https://rinkeby.etherscan.io/tx/${transactionId}`;
// console.log(url);

///////////////////// Getting Ethereum balance /////////////////////////
// let balance = eth_helper.getBalance('0x376d3306288831F63546E31F518d8b40517a5ca1');
// console.log(balance);

///////////////////// Sending Ethereum include gas //////////////////////
// let transactionId = eth_helper.sendEth(
//     '0x376d3306288831F63546E31F518d8b40517a5ca1',
//     '05bc1c66c4eb7ae2f21f420ab5368b062b336a5d1681ca555e422e2125a4d7c2',
//     '0x8D9Cb689A3c275D98737F191FbE0baB717400175',
//     0.1536745,
//     true
// );
// const url = `https://rinkeby.etherscan.io/tx/${transactionId}`;
// console.log(url);


/////////////////// Send All Ethereum //////////////////////////////////
// let transactionId = eth_helper.sendAllEth(
//     '0x376d3306288831F63546E31F518d8b40517a5ca1',
//     '05bc1c66c4eb7ae2f21f420ab5368b062b336a5d1681ca555e422e2125a4d7c2',
//     '0x8D9Cb689A3c275D98737F191FbE0baB717400175',
// );
// const url = `https://rinkeby.etherscan.io/tx/${transactionId}`;
// console.log(url);

/////////////////// Send Real Ethereum //////////////////////////////////
// let transactionId = eth_helper.sendAllEth(
//     '0x376d3306288831F63546E31F518d8b40517a5ca1',
//     '05bc1c66c4eb7ae2f21f420ab5368b062b336a5d1681ca555e422e2125a4d7c2',
//     '0x2C5e0382e307f1910CfAB91a4D840D848b0c9263',
// );
// const url = `https://etherscan.io/tx/${transactionId}`;
// console.log(url);


///////////////// Generate Ethereum wallet //////////////////////////////
// let wallet = eth_helper.generateWallet();
// console.log(wallet.privateKey);
// console.log(wallet.address);


// let v = eth_helper.getTransactions('0x8D9Cb689A3c275D98737F191FbE0baB717400175');
// console.log(v);


let actions = eos_helper.getTransactions('binadaimoney');
console.log(actions);

process.exit();
