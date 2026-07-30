const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ROOT = path.resolve(__dirname, '..')

const apiHost = () => {
  switch (process.env.HOST) {
    case 'local':
      return JSON.stringify('/api')
    case 'local-proxy':
      return JSON.stringify('http://localhost:3020/api')
    case 'uat':
      return JSON.stringify('https://portal-uat.meridianfreight.example/api')
    case 'production':
      return JSON.stringify('https://portal.meridianfreight.example/api')
    default:
      return JSON.stringify('/api')
  }
}

// NOTE: only HOST=local turns on the offline fake-data branches in the sagas.
const isDevEnv = () => JSON.stringify(process.env.HOST === 'local')
const isProdEnv = () => JSON.stringify(process.env.HOST === 'production')
const useConsole = () => JSON.stringify(process.env.HOST !== 'production')

// Set only by the `start` scripts, so the session-restore branch is dead code that
// drops out of every build (including a local `npm run build`).
const restoreDevSession = () => JSON.stringify(process.env.DEV_SESSION === '1')

module.exports = {
  entry: ['core-js/stable', path.resolve(ROOT, 'src/index.js')],
  output: {
    path: path.resolve(ROOT, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      ActionTypes: path.resolve(ROOT, 'src/constants/actionTypes.js'),
      Assets: path.resolve(ROOT, 'src/assets'),
      Components: path.resolve(ROOT, 'src/components'),
      Constants: path.resolve(ROOT, 'src/constants'),
      Hooks: path.resolve(ROOT, 'src/hooks'),
      Pages: path.resolve(ROOT, 'src/pages'),
      Redux: path.resolve(ROOT, 'src/redux'),
      Routes: path.resolve(ROOT, 'src/routes'),
      Util: path.resolve(ROOT, 'src/util'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      API_HOST: apiHost(),
      IS_DEV_ENV: isDevEnv(),
      IS_PROD_ENV: isProdEnv(),
      USE_CONSOLE: useConsole(),
      RESTORE_DEV_SESSION: restoreDevSession(),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, 'public/index.html'),
      favicon: false,
    }),
  ],
}
