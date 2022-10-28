var mssql = require('tedious')
var d = require('domain').create()
d.on('error', function(err){
    // ignore any errors and continue
})

d.run(function() {
	//Use setInterval to retry the connection
	var connectionAttempts = 1;
	var connectionCount = 0;
	var connected = false;
	console.log("Starting App...");
	setInterval(function () {
	  try {
		  if(!connected) {
			var Connection = mssql.Connection;
			var config = {
				server: '', //change ID address/servername depending on your env
				authentication: {
					type: 'default',
					options: {
						userName: '', //use sa or another user
						password: '' //enter your password here    
					}
				},
				options: {
					database:'master', //optionally change DB you are connected to
					port: 1433,
					encrypt: true
				},
				connectTimeout: '60000',
				requestTimeout: '60000',
				pool: {
					max: 10,
					min: 0,
					idleTimeoutMillis: 60000
				}
			};
			var connection = new Connection(config);
			//console.log("Connection attempt: " + connectionAttempts);
			console.log("Atempting connection...");
			connectionAttempts++;
			connection.on('connect', function(err) {
			  if (err) {
					if(err.code == "ETIMEOUT" || err.code == "EINVALIDSTATE" || err.code == "ECONNRESET" || err.code == "ECONNREFUSED" || err.code == "ESOCKET") {
					  console.log("Connection not ready. Retrying...");
					  connected = false;
					  delete connection;
					} else {
					  console.log(err);
					  connected = false;
					  delete connection;
					}	
			  } else {
				connected = true;
				connectionCount++;
				//console.log("Connected. Connection count:" + connectionCount);
				console.log("Connected.")
				setInterval(function() { getData(connection); }, 1000);
			  }
			});

			connection.connect();
		}
	  } catch (e) {
		console.log(e);
	  }
	}
	, 1000);

	function getData(connection) {
	  try {
		  var Request = require('tedious').Request;
		  request = new Request("SELECT @@SERVERNAME", function(err, rowCount) {
				if (err) {
					if(err.code == "ETIMEOUT" || err.code == "EINVALIDSTATE" || err.code == "ECONNRESET" || err.code == "ECONNREFUSED" || err.code == "ESOCKET") {
					  console.log("Connection not ready. Retrying...");
					  connected = false;
					  delete connection;
					} else {
					  console.log(err);
					  connected = false;
					  delete connection;
					}	
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
	  } catch (e) {
		console.log(e);
	  }
	}
})
