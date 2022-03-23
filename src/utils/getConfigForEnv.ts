import { Env } from '@stencil/core'
export { getEnvConfig }

interface EnvConfig {
  appPath: string
}

const configForEnv: Record<string, EnvConfig> = {
  prod: {
    appPath: '/gmail-clone'
  },
  dev: {
    appPath: ''
  }
}

function getEnvConfig() {
  return configForEnv[Env.apiEnv]
}
