const path = require('path');

module.exports = {
  entry: './src/js/index.tsx',
  mode: 'development',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'src/static/dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['node_modules', path.resolve(__dirname)]
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  }
};
