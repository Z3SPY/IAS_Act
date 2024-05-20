const express = require('express');
const app = express();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.js');
  
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
