require('dotenv').config();
const btc_helper = require('./libs/btc-helper');
const eth_helper = require('./libs/eth-helper');
const eos_helper = require('./libs/eos-helper');

let args = process.argv.slice(2);

if(args.length === 0) process.exit();

if(args[0].toUpperCase() === 'BTC') {
    if(args.length === 1) process.exit();

    if(args[1].toUpperCase() === 'CREATE') {

        console.info(JSON.stringify(btc_helper.generateWallet()));

        process.exit();

    } else if(args[1].toUpperCase() === 'BALANCE' && args.length >= 3) {

        let address = args[2];

        console.info(JSON.stringify({balance: btc_helper.getBalance(address)}))

        process.exit();

    }
} else if(args[0].toUpperCase() === 'ETH') {
    if(args.length === 1) process.exit();

    if(args[1].toUpperCase() === 'CREATE') {

        console.info(JSON.stringify(eth_helper.generateWallet()));

        process.exit();

    } else if(args[1].toUpperCase() === 'BALANCE' && args.length >= 3) {

        let address = args[2];

        console.info(JSON.stringify({balance: eth_helper.getBalance(address)}))

        process.exit();

    }
} else if(args[0].toUpperCase() === 'EOS') {
    if(args.length === 1) process.exit();

    if(args[1].toUpperCase() === 'BALANCE' && args.length >= 3) {

        let account = args[2];

        console.info(JSON.stringify({balance: eos_helper.getBalance(account)}));

        process.exit();

    }
}
