
const { getUsers, insertUser, getSpecificUser } = require('./src/connect');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

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
app.use(bodyParser.urlencoded({ extended: true }));

// Define route for fetching greeting
app.get('/get_greeting', (req, res) => {
  // You can send any response you want here
  res.send('Hello from the server!');
});

// Define route for handling login POST requests
app.post('/register', (req, res) => {
  // Handle login logic here
  // You can access form data from req.body
  // Example: const username = req.body.username;
  // Example: const password = req.body.password;
  // Example: Perform authentication logic
  
  const formData = req.body;
  console.log(formData); // Output the form data to the console
  // Perform further processing with the form data
  //res.send('Registration successful');
  //getSpecificUser(formData.username, formData.password);
});

app.post('/login', (req, res) => {
  // Handle login logic here
  // You can access form data from req.body
  // Example: const username = req.body.username;
  // Example: const password = req.body.password;
  // Example: Perform authentication logic
  
  const formData = req.body;
  console.log(formData); // Output the form data to the console
  // Perform further processing with the form data
  //res.send('Login successful');
  getUsers();

});

// Serve your static files
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
