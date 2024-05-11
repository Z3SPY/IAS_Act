
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
app.post('/register', async (req, res) => {
  try {
    const formData = req.body;
    console.log(formData); 

    const newUser = await insertUser(formData.username, formData.password, formData.email, formData.Fname, formData.Lname, formData.kingdom, formData.clan);

    // Assuming insertUser returns some data about the newly inserted user
    res.status(201).json(newUser); // Send a success response with the newly inserted user data
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});

app.post('/login', async (req, res) => {
  try {
    const formData = req.body;
    console.log(formData); // Output the form data to the console
    
    // Call getUsers function to fetch users
    const users = await getSpecificUser(formData.username, formData.password);
    
    // Log the fetched users
    console.log(users);

    if (users) {
      // Redirect to the home page
      res.redirect('/home');
    } else {
      // If login is unsuccessful, send an error response
      res.status(401).send('Invalid username or password');
    }
    
    // Send response or perform further logic based on the fetched users
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});


// Serve your static files
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
