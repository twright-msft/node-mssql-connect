var mssql = require('tedious');

var Connection = mssql.Connection;

var config = {
        userName: 'sa'
        ,password: 'sa'
        ,server: 'localhost'
        ,options: {database:'master'}
        };

var connection = new Connection(config);

var Request = mssql.Request;

connection.on('connect', function(err) {
    request = new Request("SELECT name FROM sys.databases", function(err, rowCount) {
    });

    request.on('row', function(columns) { 
        columns.forEach(function(column) {                                    
                console.log(column.value)
        })
    })
    connection.execSql(request);
});