const request = require('request');
const bitcore = require('bitcore-lib');
const explorers = require('bitcore-explorers');
const address = require('bitcoin-address');

const testmode = process.env.TEST_MODE === 'true';

const generateWallet = () => {

    const bitcoinjs = require('bitcoinjs-lib');

    let keyPair;
    if(testmode) {
        keyPair = bitcoinjs.ECPair.makeRandom({network: bitcoinjs.networks.testnet, rng: () => {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 32; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return Buffer.from(text);
            }
        });
    } else {
        keyPair = bitcoinjs.ECPair.makeRandom();
    }

    return {
        privkey: keyPair.toWIF(),
        address: bitcoinjs.payments.p2pkh({pubkey: keyPair.publicKey}).address,
    };
};


const getBalance = (addr) => {

    const url = testmode ? `https://testnet.blockchain.info/address/${addr}?format=json` :
        `https://blockchain.info/address/${addr}?format=json`;

    let result = null;

    request(url, function (error, response, body) {
        if(error) {
            result = false;
        }

        if(response.statusCode !== 200) {
            result = false;
        }

        try {
            result = JSON.parse(body).final_balance;
        } catch (e) {
            return false;
        }

    });

    while(result === null) {
        require('deasync').sleep(100);
    }

    const unit = bitcore.Unit;

    return unit.fromSatoshis(result).toBTC();
};


const sendBtc = (fromAddr, fromPrivateKey, toAddr, amountToSend, includeFee = false) => {

    let transactionId = null;
    let errorMsg = null;

    const promToSend = new Promise((resolve, reject) => {


        const unit = bitcore.Unit;
        const insight = new explorers.Insight(testmode ? 'testnet' : 'mainnet');
        const minerFee = unit.fromMilis(0.128).toSatoshis(); //cost of transaction in satoshis (minerfee)
        let transactionAmount = unit.fromBTC(amountToSend).toSatoshis(); //convert mBTC to Satoshis using bitcore unit

        if(includeFee) transactionAmount -= minerFee;

        const address_type = testmode ? 'testnet' : 'prod';

        if (!address.validate(fromAddr, address_type)) {
            return reject('Origin address checksum failed');
        }
        if (!address.validate(toAddr, address_type)) {
            return reject('Recipient address checksum failed');
        }

        insight.getUnspentUtxos(fromAddr, function(error, utxos) {
            if (error) {
                //any other error
                console.log(error);
                return reject(error);
            } else {
                if (utxos.length === 0) {
                    //if no transactions have happened, there is no balance on the address.
                    return reject("You don't have enough Satoshis to cover the miner fee.");
                }
                //get balance
                let balance = unit.fromSatoshis(0).toSatoshis();
                for (var i = 0; i < utxos.length; i++) {
                    balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
                }

                console.log('transactionAmount: ' + transactionAmount);
                console.log('minerFee: ' + minerFee);
                console.log('balance: ' + balance);

                //check whether the balance of the address covers the miner fee
                if ((balance - transactionAmount - minerFee) > 0) {

                    //create a new transaction
                    try {
                        let bitcore_transaction = new bitcore.Transaction()
                            .from(utxos)
                            .to(toAddr, transactionAmount)
                            .fee(minerFee)
                            .change(fromAddr)
                            .sign(fromPrivateKey)
                        ;

                        //handle serialization errors
                        if (bitcore_transaction.getSerializationError()) {
                            let error = bitcore_transaction.getSerializationError().message;
                            switch (error) {
                                case 'Some inputs have not been fully signed':
                                    return reject('Please check your private key');
                                default:
                                    return reject(error);
                            }
                        }

                        // broadcast the transaction to the blockchain
                        insight.broadcast(bitcore_transaction, function(error, body) {
                            if (error) {
                                reject('Error in broadcast: ' + error);
                            } else {
                                resolve(transactionId);
                            }
                        });

                    } catch (error) {

                        return reject(error.message);
                    }
                } else {
                    return reject("You don't have enough Satoshis to cover the miner fee.");
                }
            }
        });
    });

    promToSend.then(function(result) {
        transactionId = result;
    }, function (error) {
        errorMsg = error;
    });

    while(transactionId === null && errorMsg === null) {
        require('deasync').sleep(100);
    }

    if(errorMsg !== null) {
        throw errorMsg;
    }

    return transactionId;
};


const sendAllBtc = (fromAddr, fromPrivateKey, toAddr) => {

    return sendBtc(fromAddr, fromPrivateKey, toAddr, getBalance(fromAddr), true);
};


module.exports = {
    generateWallet: generateWallet,
    getBalance: getBalance,
    sendBtc: sendBtc,
    sendAllBtc: sendAllBtc,
};