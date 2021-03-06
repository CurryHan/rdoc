const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opn = require('opn');
const detect = require('detect-port');
const load = require('loading-cli');
const conf = require('./conf/webpack.config.dev');
const createDevServerConfig = require('./conf/webpack.config.server');
require('colors-cli/toxic');

module.exports = function server(cmd) {
  const HOST = cmd.host;
  let DEFAULT_PORT = cmd.port;
  const webpackConf = conf(cmd);
  const compiler = webpack(webpackConf);
  const loading = load('Compiler is running...'.green).start();
  loading.color = 'green';

  // https://webpack.js.org/api/compiler-hooks/#aftercompile
  // 编译完成之后打印日志
  compiler.hooks.done.tap('done', () => {
    loading.stop();
    // eslint-disable-next-line
    console.log(`\nDev Server Listening at ${`http://${HOST}:${DEFAULT_PORT}`.green}`);
  });

  detect(DEFAULT_PORT).then((_port) => {
    if (DEFAULT_PORT !== _port) DEFAULT_PORT = _port;
    new WebpackDevServer(compiler, createDevServerConfig(cmd, webpackConf)).listen(DEFAULT_PORT, HOST, (err) => {
      if (err) {
        return console.log(err); // eslint-disable-line
      }
      // open browser
      opn(`http://${HOST}:${DEFAULT_PORT}`);
    });
  }).catch((err) => {
    console.log(err); // eslint-disable-line
  });
};
