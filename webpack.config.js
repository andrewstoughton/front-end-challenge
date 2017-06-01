const path = require('path');
const webpack = require('webpack');
 
const config = {
  devtool: 'source-map',
  entry: path.join(__dirname, 'src', 'js', 'app.js'),
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
      }
    }]
  }
};

module.exports = config;