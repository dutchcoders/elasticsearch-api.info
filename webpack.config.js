var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './src/main.js',
/*
  output: { path: __dirname, filename: 'bundle.js' },
*/
  output: {  filename: 'bundle.js' },
  target: 'web',
  /*
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
  },
  */
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [ 'es2015', 'stage-1', 'react'],
        }
      }
    ]
  },
};

