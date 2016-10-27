var mssql = require('tedious')

//Use setInterval to retry the connection
var connectionAttempts = 1;
var connected = false;
console.log("Attempting connection...");
setInterval(function () {
  if(!connected) {
    var Connection = mssql.Connection;
    var config = {
        userName: 'sa'
        ,password: 'sa'
        ,server: 'localhost'
        ,options: {database:'master'}
        /* Uncomment if you need to debug connections/queries
        ,debug:
          {
          packet: false,
          data: false,
          payload: false,
          token: false,
          log: false
          }*/
        };
    var connection = new Connection(config);
    console.log("Connection attempt: " + connectionAttempts);
    connectionAttempts++;
    /* Uncomment if you need to debug connections/queries
    connection.on('infoMessage', infoError);
    connection.on('errorMessage', infoError);
    connection.on('debug', debug);
    */
    connection.on('connect', function(err) {
      if (err) {
        console.log(err);
        connected = false;
      } else {
        connected = true;
        console.log("Connected");
        setInterval(function() { getData(connection); }, 1000);
      }
    });
  }
}
, 1000);

function getData(connection) {
  console.log("Getting Data...");
  var Request = require('tedious').Request;
  request = new Request("SELECT HOST_NAME()", function(err, rowCount) {
        if (err) {
            connected = false;
            console.log(err);
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