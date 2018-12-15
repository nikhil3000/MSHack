const mysql = require('mysql');

var config =
{
    host: 'parina.mysql.database.azure.com',
    user: 'parinaA@parina',
    password: '@Abc123456789',
    database: 'MSHack',
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
       console.log("Connection established.");
    }   
});



