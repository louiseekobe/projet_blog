const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
    form : path.resolve(__dirname, 'src/form/form.js'),
    topbar : path.resolve(__dirname, 'src/assets/javascript/topbar.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "*",
          context: path.resolve(__dirname, "src", "assets","images"),
          to: "assets/images"
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html', 
      template: path.resolve(__dirname, 'src/index.html'),
      chunks: ["main", "topbar"]
    }),
    new HtmlWebpackPlugin({
      filename: 'form.html',
      template: path.resolve(__dirname, 'src/form/form.html'),
      chunks: ["form", "topbar"]
    }),
  ],
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    inline: true,
    open: true,
    port: 4000,
    historyApiFallback:true
  },
};