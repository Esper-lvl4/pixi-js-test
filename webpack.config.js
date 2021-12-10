const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: '/\.m?js$/',
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
              emitFile: true,
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(ttf|otf)/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            emtFile: true,
            esModule: false,
          },
        }],
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/assets', to: 'assets' }],
      options: { concurrency: 100 },
    }),
    new HtmlWebpackPlugin({ template: './src/index.html'}),
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'src/assets'),
    },
    compress: true,
    port: 9000,
  }
}