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

async function getUsers() {
  return new Promise((resolve, reject) => {
    var request = new Request("SELECT * FROM [dbo].[UserAccount];", (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
    });
    var result = [];
    request.on("row", (columns) => {
      var row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });
      result.push(row);
    });

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", (rowCount, more) => {
      resolve(result);
    });
    connection.execSql(request);
  });
}

async function getSpecificUser(username) {
  console.log("pog");

  return new Promise((resolve, reject) => {
    var request = new Request(
      "SELECT * FROM [dbo].[UserAccount] WHERE Username = @Username;",
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
      }
    );

    // Add parameters for the username and password
    request.addParameter("Username", TYPES.NVarChar, username);

    var result = null;

    request.on("row", (columns) => {
      result = {};
      columns.forEach((column) => {
        result[column.metadata.colName] = column.value;
      });
    });

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", () => {
      resolve(result);
    });

    connection.execSql(request);
  });
}


function insertUser(username, passwordHash, salt, email, firstName, lastName, clan, kingdom) {
  var request = new Request(
    "INSERT INTO [dbo].[UserAccount] \
    (Username, PasswordHash, Salt, Email, FirstName, LastName, Clan, Kingdom) \
    VALUES (@Username, @PasswordHash, @Salt, @Email, @FirstName, @LastName, @Clan, @Kingdom);",
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("User inserted successfully.");
      }
    }
  );

  // Add parameters for username, password, email, firstName, lastName, clan, and kingdom
  request.addParameter("Username", TYPES.NVarChar, username);
  request.addParameter("PasswordHash", TYPES.NVarChar, passwordHash);
  request.addParameter("Salt", TYPES.NVarChar, salt);
  request.addParameter("Email", TYPES.NVarChar, email);
  request.addParameter("FirstName", TYPES.NVarChar, firstName);
  request.addParameter("LastName", TYPES.NVarChar, lastName);
  request.addParameter("Clan", TYPES.NVarChar, clan);
  request.addParameter("Kingdom", TYPES.NVarChar, kingdom);

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function() {
    //connection.close();
  });

  connection.execSql(request);
}

// Exporting the function without executing it
module.exports = {
  connection: connection,
  getUsers: getUsers,
  getSpecificUser: getSpecificUser,
  insertUser: insertUser,
};
