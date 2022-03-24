import { getEnvConfig } from './getConfigForEnv'
export { AppRoute }

const AppRoute = {
  getPath(path: string) {
    const { appPath } = getEnvConfig()
    return appPath + path
  }
}
