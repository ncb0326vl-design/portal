const merge = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require('./base')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }],
  },
  // Patches edited components in place instead of reloading the page, so component state
  // (tab, search form) survives a save. Needs the `react-refresh/babel` plugin, enabled by
  // BABEL_ENV=hmr in `npm start`.
  // This only covers modules that export components — the redux tree keeps its state
  // because Redux/store.js accepts ./reducers and ./sagas as its own HMR boundary.
  plugins: [new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: 'wds' } })],
  devServer: {
    host: 'localhost',
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3020',
        changeOrigin: true,
      },
    },
  },
})
