require("dotenv").config();
var Connection = require("tedious").Connection;
var config = {
  server: process.env.VITE_AZURE_SQL_SERVER, //update me
  authentication: {
    type: "default",
    options: {
      userName: process.env.VITE_USERNAME, //update me
      password: process.env.VITE_PASSWORD, //update me
    },
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: "ussers", //update me
  },
};
var connection = new Connection(config);
connection.on("connect", function(err) {
  // If no error, then good to proceed.
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
    executeStatement();
  }
});

connection.connect();

var Request = require("tedious").Request;
var TYPES = require("tedious").TYPES;

function executeStatement() {
  var request = new Request("SELECT * FROM [dbo].[UserAccount];", function(
    err,
  ) {
    if (err) {
      console.log(err);
    }
  });
  var result = "";
  request.on("row", function(columns) {
    columns.forEach(function(column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    result = "";
  });

  request.on("done", function(rowCount, more) {
    console.log(rowCount + " rows returned");
  });

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function(rowCount, more) {
    connection.close();
  });
  connection.execSql(request);
}

module.exports = executeStatement;
