import { Configuration, RuleSetRule } from 'webpack';

const isDev = true;

export const tsRuleBase: RuleSetRule = {
  test: /\.ts$/i,
  loader: 'ts-loader',
};

export const commonConfig: Configuration = {
  mode: isDev ? 'development' : 'production',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
};
