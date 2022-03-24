import { Config } from '@stencil/core';

import { sass } from '@stencil/sass';
// https://stenciljs.com/docs/config
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;
const apiEnv: string = dev ? 'dev' : 'prod';
export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
      serviceWorker: null,
      baseUrl: getBaseUrl(),
    },
  ],
  env: {
    apiEnv,
  },
  plugins: [sass()],
};

function getBaseUrl() {
  if (apiEnv === 'prod') {
    return 'https://harshrohila.github.io';
  }

  return 'https://.local/';
}
