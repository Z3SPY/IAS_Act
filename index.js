const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html'); // change the path to your index.html
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
