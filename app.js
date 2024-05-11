const { getUsers, insertUser } = require('./src/connect');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Route for the root URL to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});

app.get('/home', async (req, res) => {
  users = await getUsers()
  data = users
  console.log(users)
  res.render('home.ejs', { data }); // Pass data to the template
});
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
      console.log("LOGGED IN")
      res.redirect('/home');
    } else {
      res.status(401).send("Login failed");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
