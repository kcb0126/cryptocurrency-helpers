const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder} = require('text-encoding');
const deasync = require('deasync');

const testmode = process.env.TEST_MODE === 'true';


const kylinnet = 'https://api-kylin.eosasia.one';
const huobipool = 'http://peer1.eoshuobipool.com:8181';

const apiEndpoint = testmode ? kylinnet : huobipool;

const rpc = new JsonRpc(apiEndpoint, { fetch });

EosApi = require('eosjs-api'); // Or EosApi = require('./src')


const eos = EosApi({
    httpEndpoint: apiEndpoint, // default, null for cold-storage
    verbose: false, // API logging
    logger: { // Default logging functions
        log: null,
        error: null
    },
    fetchConfiguration: {}
});


const getBalance = (account) => {
    let result = null;

    eos.getAccount(account).then((response) => {

        result = response.core_liquid_balance.split(' ')[0]; // '####.#### EOS' to '####.####'

    });

    while(result === null) {
        deasync.sleep(100);
    }

    return result;

};


const sendEos = (fromAccount, fromActivePriv, toAccount, amountToSend, memo) => {

    let result = null;

    const signatureProvider = new JsSignatureProvider([fromActivePriv]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    api.transact({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: fromAccount,
                permission: 'active',
            }],
            data: {
                from: fromAccount,
                to: toAccount,
                quantity: `${Number(amountToSend).toFixed(4)} EOS`,
                memo: memo,
            }
        }],
    }, {
        blocksBehind: 3,
        expireSeconds: 60,
    }).then(function(res) {
        result = res;
    }, function (error) {

    });

    while (result === null) {
        deasync.sleep(100);
    }

    return result.transaction_id;
};


module.exports = {
    getBalance: getBalance,
    sendEos: sendEos,
};