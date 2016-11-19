module.exports = {
  entry: './app/client/Application.jsx',
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
        test: /\.js(x?)$/,
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    ]
  },
  plugins: [],
};
