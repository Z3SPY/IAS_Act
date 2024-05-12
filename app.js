
const { getUsers, insertUser, getSpecificUser } = require('./src/connect');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const { warn } = require('console');

const app = express();
const port = 3000;

function setPassword(password) {
  salt = crypto.randomBytes(16).toString('hex');
    // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
  hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`)
  return [salt, hash]
}
function isPassValid(password, salt, givenHash) {
  let hash = crypto.pbkdf2Sync(password,
          salt, 1000, 64, `sha512`).toString(`hex`);
      return givenHash === hash;
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the root URL to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});


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

    let newUser = null;
    const users = await getSpecificUser(formData.username);
    if(users){
      res.status(400).send('Passwords do not match');
      console.log("Invalid Username")
      return
    }
    if (formData.password === formData.confirmPassword) {
      password = setPassword(formData.password)
      newUser = insertUser(formData.username, password[1].toString(), password[0].toString(), formData.email, formData.Fname, formData.Lname, formData.kingdom, formData.clan);
      res.status(201).json(newUser); // Send a success response with the newly inserted user data
      const data = await getUsers()
      res.render('home.ejs', { data }); // Pass data to the template
    } else {
      // Passwords do not match, display an error pop-
      res.status(400).send('Passwords do not match');
      console.log("Does not match");
    }
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
    const user = await getSpecificUser(formData.username);

    const hcaptchaResponse = formData['h-captcha-response']; // Use the h-captcha-response key
    const hcaptchaSecretKey = 'ES_7e2983223b5c4601a84fdc82bdc5359c';
    const verificationUrl = `https://hcaptcha.com/siteverify`;
    const verificationData = {
      secret: hcaptchaSecretKey,
      response: hcaptchaResponse
    };
    const hcaptchaVerification = await axios.post(verificationUrl, verificationData);

    if (hcaptchaVerification.data.success) {
      console.log("VERIFICATION SUCCESS")
      // res.status(400).send('hCaptcha verification failed');
      return;
    }
    else{
      res.status(400).send('hCaptcha verification failed');
      console.log(hcaptchaVerification.data)
      return;
    }
    
    // Log the fetched users
    console.log(user);
    console.log(user.Salt)
    console.log(user.PasswordHash)

    if (isPassValid(formData.password, user.Salt, user.PasswordHash)) {
      // Redirect to the home page
      const data = await getUsers()
      res.render('home.ejs', { data }); // Pass data to the template
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
