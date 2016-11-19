var webpack = require('webpack');
var config = require('./webpack.config.js');

// https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
config.plugins.push(
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production")
    }
  })
);

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);

config['devtool'] = 'source-map';

module.exports = config;
