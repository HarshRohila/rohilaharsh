const cdn = 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.prod.js'

main()

async function main() {
  initializeGetStars()

  await setupVueJs()
}

async function initializeGetStars() {
  async function getStarsFromRepoUrl(repoUrl: string): Promise<number> {
    try {
      // Extracting owner and repo name from the URL
      const urlParts = repoUrl.split('/')
      const owner = urlParts[urlParts.length - 2]
      const repo = urlParts[urlParts.length - 1]

      // Making the API request to get repository information
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
      const response = await axios.get(apiUrl)

      // Extracting the star count from the response
      const { stargazers_count } = response.data
      return stargazers_count
    } catch (error) {
      console.error('Error retrieving star count:', error)
      return 0
    }
  }

  const APP_NAME = 'web-dev-blog'

  // @ts-ignore
  window[APP_NAME] = {
    getStarsFromRepoUrl
  }

  const loadedEvent = new CustomEvent('script-loaded')
  document.body.dispatchEvent(loadedEvent)
}

async function setupVueJs() {
  const Vue = await import(cdn)

  var app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
      return {
        message: 'hi'
      }
    }
  }).mount('body')
}
