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
    //connection.close();
  });
  connection.execSql(request);
}

function insertUser(username, password, email) {
  // Generate a random ID
  var randomID = generateRandomID();

  var request = new Request(
    "INSERT INTO [dbo].[UserAccount] (UserID, Username, Password, Email) VALUES (@ID, @Username, @Password, @Email);",
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("User inserted successfully.");
      }
    }
  );

  // Add parameters for the ID, username, password, and email
  request.addParameter("ID", TYPES.NVarChar, randomID);
  request.addParameter("Username", TYPES.NVarChar, username);
  request.addParameter("Password", TYPES.NVarChar, password);
  request.addParameter("Email", TYPES.NVarChar, email);

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function() {
    //connection.close();
  });

  connection.execSql(request);
}

// Function to generate a random ID
function generateRandomID() {
  var characters = "0123456789";
  var length = 5;
  var randomID = "";
  for (var i = 0; i < length; i++) {
    randomID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomID;
}

// Exporting the function without executing it
module.exports = {
  connection: connection,
  executeStatement: executeStatement,
  insertUser: insertUser,
};