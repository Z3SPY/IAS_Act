const path = require('path');

module.exports = {
  mode: 'production',
  entry: './app.js',
  output: {
    path: __dirname + '/public', 
    publicPath: '/public',
    filename: 'final.js',
  },
  target: 'node',
};