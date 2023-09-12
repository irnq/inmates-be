import { serverConfig } from './webpack.part';
import { commonConfig } from './webpack.common';

export default [{ ...commonConfig, ...serverConfig }];
