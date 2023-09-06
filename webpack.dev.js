const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "/dist"),
    open: true,
    compress: true,
    port: 8000,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});