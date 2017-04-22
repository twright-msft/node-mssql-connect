var mssql = require('tedious')

//Use setInterval to retry the connection
var connectionAttempts = 1;
var connectionCount = 0;
var connected = false;
console.log("Attempting connection...");
setInterval(function () {
  if(!connected) {
    var Connection = mssql.Connection;
    var config = {
        userName: 'sa' //use sa or another user
        ,password: 'Yukon900' //enter your password here
        ,server: 'localhost' //change ID address/servername depending on your env
        ,options: {database:'master'}  //optionally change DB you are connected to
        };
    var connection = new Connection(config);
    console.log("Connection attempt: " + connectionAttempts);
    connectionAttempts++;
    connection.on('connect', function(err) {
      if (err) {
        console.log(err);
        connected = false;
        delete connection;
      } else {
        connected = true;
        connectionCount++;
        console.log("Connected. Connection count:" + connectionCount);
        setInterval(function() { getData(connection); }, 1000);
      }
    });
  }
}
, 1000);

function getData(connection) {
  console.log("Getting Data...");
  var Request = require('tedious').Request;
  request = new Request("SELECT @@SERVERNAME, HOST_NAME()", function(err, rowCount) {
        if (err) {
            console.log(err);
            connected = false;
            delete connection;
        }
  });
  
  request.on('row', function(columns) { 
    columns.forEach(function(column) {  
      if (column.value === null) {  
        console.log('NULL');
      } else {  
        console.log(column.value);
      }  
    });
  });

  connection.execSql(request);  
}
