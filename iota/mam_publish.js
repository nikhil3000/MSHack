const Mam = require('./lib/mam.client.js');
const IOTA = require('iota.lib.js');
const moment = require('moment');
const iota = new IOTA({ provider: 'https://nodes.testnet.iota.org:443' });
const mysql = require('mysql');

const MODE = 'restricted'; // public, private or restricted
const SIDEKEY = 'mysecret'; // Enter only ASCII characters. Used only in restricted mode
const SECURITYLEVEL = 3; // 1, 2 or 3
const TIMEINTERVAL = 10; // seconds


var config =
{
    host: 'parina.mysql.database.azure.com',
    user: 'parinaA@parina',
    password: '@Abc123456789',
    database: 'MSHack',
    port: 3306,
    ssl: true
};

// Initialise MAM State
let mamState = Mam.init(iota, undefined, SECURITYLEVEL);

// Set channel mode
if (MODE == 'restricted') {
    const key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);

} else {
    mamState = Mam.changeMode(mamState, MODE);
}

// Publish data to the tangle
const publish = async function (packet) {
    // Create MAM Payload
    const trytes = iota.utils.toTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // Save new mamState
    mamState = message.state;
    console.log('Root: ', message.root);
    console.log('Address: ', message.address);

    // Attach the payload
    await Mam.attach(message.payload, message.address);
    
    return message.root;
}

const generateJSON = function () {
    // Generate some random numbers simulating sensor data
    const pH = Math.floor((Math.random() * 100) % 14);
    const magnet = Math.floor((Math.random() * 10) % 2);
    const organicMatter = Math.floor((Math.random() * 89) + 10);
    const data4 = Math.floor((Math.random() * 89) + 10);
    const data5 = Math.floor((Math.random() * 89) + 10);
    const dateTime = moment().utc().format('DD/MM/YYYY hh:mm:ss');
    const json = { "data": data, "dateTime": dateTime };
    return json;
}

const executeDataPublishing = async function () {
    console.log("sub seq data");
    const json = generateJSON();
    console.log("json=", json);

    const root = await publish(json);
    console.log(`dateTime: ${json.dateTime}, data: ${json.data}, root: ${root}`);
}

const firstPublish = async function () {
    console.log("first publish");
    const json = generateJSON();
    console.log("json=", json);

    const root = await publish(json);
    console.log("33333333333333333333333333333333333333");
    console.log(`dateTime: ${json.dateTime}, data: ${json.data}, root: ${root}`);
    try{
        const conn = new mysql.createConnection(config);
        conn.connect(
            function (err) {
                if (err) {
                    console.log("!!! Cannot connect !!! Error:");
                    throw err;
                }
                else {
                    console.log("Connection established.");
                    var updateRootQuery = `UPDATE main SET root="${root}" where pk=1`;
                    conn.query(updateRootQuery, function (err, result) {
                        if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated");
                    });
                }
            });
    }
    catch(e)
    {
        console.log("error in sql connection");
        console.log(e);
    }
    
}
// Start it immediately

firstPublish();
setInterval(executeDataPublishing, TIMEINTERVAL * 1000);
