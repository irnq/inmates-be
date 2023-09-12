import { Configuration, RuleSetRule, DefinePlugin } from 'webpack';
import { join } from 'path';
import { tsRuleBase } from './webpack.common';
import CopyPlugin from 'copy-webpack-plugin';
require('dotenv').config();

// , WatchIgnorePlugin, WebpackPluginInstance

// const serverPlugins: WebpackPluginInstance[] = [
//   new WatchIgnorePlugin({
//     paths: [join(__dirname, 'src')],
//   }),
// ];
const tsRuleServer: RuleSetRule = {
  ...tsRuleBase,
  options: {
    configFile: join(__dirname, 'tsconfig.json'),
  },
};
export const serverConfig: Configuration = {
  entry: join(__dirname, 'src', 'server.ts'),
  output: {
    path: join(__dirname, 'dist'),
    filename: 'server.js',
  },
  target: 'node',
  // plugins: serverPlugins,
  module: {
    rules: [tsRuleServer],
  },
  plugins: [
    new DefinePlugin({
      'process.env.HARPERDB_URL': JSON.stringify(process.env.HARPERDB_URL),
      'process.env.HARPERDB_PW': JSON.stringify(process.env.HARPERDB_PW),
      'process.env.HARPERDB_SCHEMA': JSON.stringify(process.env.HARPERDB_SCHEMA),
      'process.env.BCRYPT_SALT': JSON.stringify(process.env.BCRYPT_SALT),
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.JWT_ACCESS_SECRET': JSON.stringify(process.env.JWT_ACCESS_SECRET),
      'process.env.JWT_REFRESH_SECRET': JSON.stringify(process.env.JWT_REFRESH_SECRET),
      'process.env.SMTP_HOST': JSON.stringify(process.env.SMTP_HOST),
      'process.env.SMTP_PORT': JSON.stringify(process.env.SMTP_PORT),
      'process.env.SMTP_USER': JSON.stringify(process.env.SMTP_USER),
      'process.env.SMTP_PASSWORD': JSON.stringify(process.env.SMTP_PASSWORD),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.PROJECT_NAME': JSON.stringify(process.env.PROJECT_NAME),
      'process.env.CLIENT_URL': JSON.stringify(process.env.CLIENT_URL),
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/utils/mail-templates', to: 'mail-templates' }],
    }),
  ],
};
