const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/'
  ],
  output: {
    filename: 'dist/app.js'
  },
  resolve: {
    extensions: [ '.ts', '.js', '.tsx' ],
    alias: {
      static: path.join( __dirname, 'static')
    }
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'fast-sass-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],

  devServer: {
    host: 'localhost',
    port: 8000,
    inline: true,
    historyApiFallback: true,
    hot: true
  }
};