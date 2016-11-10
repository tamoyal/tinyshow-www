module.exports = {
  entry: './app/react/Application.jsx',
  output: {
    path: __dirname,
    filename: './public/app.js'
  },
  resolve: {
    root: __dirname,
    alias: {
      
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        },
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
};
