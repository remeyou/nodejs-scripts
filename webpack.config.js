const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      { test: /.ts$/, use: { loader: 'ts-loader' }, exclude: /node_modules/ },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  target: 'node',
};
