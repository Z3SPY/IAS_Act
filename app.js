const express = require('express');
const fs = require("fs");
const executeStatement = require("./src/connect.js");

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the root URL to serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// Route for handling register POST requests
app.post('/register', (req, res) => {
  
})


// Route for handling login POST requests
app.post('/login', (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const params = new URLSearchParams(body);
    const username = params.get("username");
    const password = params.get("password");

    if (username === "user" && password === "password") {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Login failed");
    }
  });
});

// Route for handling /sql GET requests
app.get('/sql', (req, res) => {
  fs.readFile("./index.html", (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log(executeStatement());
    res.status(200).type('html').send(data);
  });
});

// Handling other routes
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
