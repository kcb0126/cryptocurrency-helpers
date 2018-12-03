require('dotenv').config();
const btc_helper = require('./libs/btc-helper');
const eth_helper = require('./libs/eth-helper');
const eos_helper = require('./libs/eos-helper');

const showUsageExit = () => {
    console.info('For help, run "node index --help"');
    process.exit();
};

let args = process.argv.slice(2);

if(args.length === 0) showUsageExit();

if(args[0] === '--help') {

    console.info('Usage: node index <coin> <command>');

    console.info('');

    console.info('coin: BTC, ETH, EOS');

    console.info('');

    console.info('command:');

    console.info('CREATE: create a new wallet');
    console.info('BALANCE: ');
    console.info('SEND: ');
    console.info('SENDALL: ');
    console.info('TRANSACTIONS: ');

    process.exit();

}

if(args[0].toUpperCase() === 'BTC') {
    if(args.length === 1) showUsageExit();

    if(args[1].toUpperCase() === 'CREATE') {

        console.info(JSON.stringify(btc_helper.generateWallet()));

        process.exit();

    } else if(args[1].toUpperCase() === 'BALANCE' && args.length >= 3) {

        let address = args[2];

        console.info(JSON.stringify({balance: btc_helper.getBalance(address)}));

        process.exit();

    } else if(args[1].toUpperCase() === 'SEND' && args.length >= 6) {

        let fromAddress = args[2];
        let fromPrivateKey = args[3];
        let toAddress = args[4];
        let amountToSend = args[5];

        let include = false;

        if(args.length >= 7 && args[6].toUpperCase() === 'INCLUDE') include = true;

        let transaction_id = btc_helper.sendBtc(fromAddress, fromPrivateKey, toAddress, amountToSend, include);

        console.info(JSON.stringify({transaction_id: transaction_id}));

        process.exit();

    } else if(args[1].toUpperCase() === 'SENDALL' && args.length >= 5) {

        let fromAddress = args[2];
        let fromPrivateKey = args[3];
        let toAddress = args[4];

        let transaction_id = btc_helper.sendAllBtc(fromAddress, fromPrivateKey, toAddress);

        console.info(JSON.stringify({transaction_id: transaction_id}));

        process.exit();

    } else if(args[1].toUpperCase() === 'TRANSACTIONS' && args.length >= 3) {

        let address = args[2];

        let transactions = btc_helper.getTransactions(address);

        console.info(JSON.stringify({transactions: transactions}));

        process.exit();

    } else {
        showUsageExit();
    }


} else if(args[0].toUpperCase() === 'ETH') {
    if(args.length === 1) showUsageExit();

    if(args[1].toUpperCase() === 'CREATE') {

        console.info(JSON.stringify(eth_helper.generateWallet()));

        process.exit();

    } else if(args[1].toUpperCase() === 'BALANCE' && args.length >= 3) {

        let address = args[2];

        console.info(JSON.stringify({balance: eth_helper.getBalance(address)}));

        process.exit();

    } else if(args[1].toUpperCase() === 'SEND' && args.length >= 6) {

        let fromAddress = args[2];
        let fromPrivateKey = args[3];
        let toAddress = args[4];
        let amountToSend = args[5];

        let include = false;

        if(args.length >= 7 && args[6].toUpperCase() === 'INCLUDE') include = true;

        let transaction_id = eth_helper.sendEth(fromAddress, fromPrivateKey, toAddress, amountToSend, include);

        console.info(JSON.stringify({transaction_id: transaction_id}));

        process.exit();

    } else if(args[1].toUpperCase() === 'SENDALL' && args.length >= 5) {

        let fromAddress = args[2];
        let fromPrivateKey = args[3];
        let toAddress = args[4];

        let transaction_id = eth_helper.sendAllEth(fromAddress, fromPrivateKey, toAddress);

        console.info(JSON.stringify({transaction_id: transaction_id}));

        process.exit();

    } else if(args[1].toUpperCase() === 'TRANSACTIONS' && args.length >= 3) {

        let address = args[2];

        let transactions = eth_helper.getTransactions(address);

        console.info(JSON.stringify({transactions: transactions}));

        process.exit();

    } else {
        showUsageExit();
    }


} else if(args[0].toUpperCase() === 'EOS') {
    if(args.length === 1) showUsageExit();

    if(args[1].toUpperCase() === 'BALANCE' && args.length >= 3) {

        let account = args[2];

        console.info(JSON.stringify({balance: eos_helper.getBalance(account)}));

        process.exit();

    } else if(args[1].toUpperCase() === 'SEND' && args.length >= 6) {

        let fromAccount = args[2];
        let fromActivePriv = args[3];
        let toAccount = args[4];
        let amountToSend = args[5];
        let memo = args.length >= 7 ? args[6] : '';

        let transaction_id = eos_helper.sendEos(fromAccount, fromActivePriv, toAccount, amountToSend, memo);

        console.info(JSON.stringify({transaction_id: transaction_id}));

        process.exit();

    } else if(args[1].toUpperCase() === 'TRANSACTIONS' && args.length >= 3) {

        let account = args[2];

        let transactions = eos_helper.getTransactions(account);

        console.info(JSON.stringify({transactions: transactions}));

        process.exit();

    } else {
        showUsageExit();
    }
} else {
    showUsageExit();
}
