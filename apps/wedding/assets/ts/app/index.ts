const cdn = 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.prod.js'

async function main() {
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

main()
