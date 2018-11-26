require('dotenv').config();

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const log = require('ololog').configure({time: true});
const keythereum = require('keythereum');
const utils = require('ethereumjs-util');

const testmode = process.env.TEST_MODE === 'true';


/**
 * Network configuration
 */
const mainnet = `https://mainnet.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`;
const testnet = `https://rinkeby.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`;


/**
 * Change the provider that is passed to HttpProvider to `mainnet` for live transactions.
 */
const networkToUse = testmode ? testnet : mainnet;
const web3 = new Web3( new Web3.providers.HttpProvider(networkToUse));


const generatePrivateKey = () => {
    let param = {keyBytes: 32, ivBytes: 16};
    let dk = keythereum.create(param);

    return dk.privateKey;
};


const generateWalletHex = () => {
    let privateKey = generatePrivateKey();
    let address = utils.privateToAddress(privateKey);

    return {
        privkey: utils.bufferToHex(privateKey),
        address: utils.bufferToHex(address),
    };
};


const getBalance = (addr) => {

    let balanceWei = web3.eth.getBalance(addr).toNumber();

    return balanceEther = web3.fromWei(balanceWei, 'ether');
};


const sendEth = (fromAddr, fromPrivateKey, toAddr, amountToSend, includeGas = false) => {

    let nonce = web3.eth.getTransactionCount(fromAddr);
    let gasPriceWei = Number(web3.eth.gasPrice.toString());
    let amountWei = web3.toWei(amountToSend, 'ether');
    if(includeGas) amountWei -= gasPriceWei * 21000;

    /**
     * Build a new transaction object and sign it locally.
     */
    let details = {
        "to": toAddr,
        "value": web3.toHex( amountWei ),
        "gas": web3.toHex(21000),
        "gasPrice": web3.toHex(gasPriceWei), // converts the gwei price to wei
        "nonce": nonce,
        "chainId": testmode ? 4 : 1 // EIP 155 chainId - mainnet: 1, rinkeby: 4
    };

    const transaction = new EthereumTx(details);


    /**
     * This is where the transaction is authorized on your behalf.
     * The private key is what unlocks your wallet.
     */
    transaction.sign( Buffer.from(fromPrivateKey, 'hex') );


    /**
     * Now, we'll compress the transaction info down into a transportable object.
     */
    const serializedTransaction = transaction.serialize();

    return web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex'));
};


const sendAllEth = (fromAddr, fromPrivateKey, toAddr) => {

    return sendEth(fromAddr, fromPrivateKey, toAddr, getBalance(fromAddr), true);
};


module.exports = {
    generateWallet: generateWalletHex,
    getBalance: getBalance,
    sendEth: sendEth,
    sendAllEth: sendAllEth,
};