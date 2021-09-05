const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");
module.exports = {
  entry: path.join(__dirname, "src/server/app/index.js"),
  target: "node",
  mode: "production",
  output: {
    filename: "[name].js", //filename: "server.js",
    path: path.join(__dirname, "dist/server"),
    libraryTarget: "commonjs2",
  },
  externals: [nodeExternals()],
  watch: true,
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "isomorphic-style-loader",
          // MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, "postcss.config.js"),
              },
            },
          },

          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    //   chunkFilename: "[id].css",
    // }),
  ],
  devServer: {},
};
