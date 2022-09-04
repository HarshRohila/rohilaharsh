import { createRouter } from '@stencil/router'
import { getEnvConfig } from './getConfigForEnv'
export { AppRoute, Router }

const AppRoute = {
  getPath(path: string) {
    const { appPath } = getEnvConfig()
    return appPath + path
  }
}

const Router = createRouter()
