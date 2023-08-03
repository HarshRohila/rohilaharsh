const scriptEl = document.currentScript as HTMLScriptElement
const APP_NAME = 'web-dev-blog'

const setStar = () => {
  const url = scriptEl.getAttribute('data-url')

  window[APP_NAME].getStarsFromRepoUrl(url).then((stars: number) => {
    const container = getStarsContainer()
    console.log(stars)

    if (stars) {
      container.textContent = stars.toString()
      showTemplate()
    }
  })
}

if (window[APP_NAME]) {
  setStar()
} else {
  document.body.addEventListener('script-loaded', setStar)
}

function getLabel() {
  return scriptEl.getAttribute('data-label')
}

function getStarsContainer(): HTMLElement {
  const label = getLabel()
  const el = document.querySelector(`.github-stars.${label}`) as HTMLSpanElement
  return el
}

function showTemplate() {
  const label = getLabel()
  const divEl = document.querySelector(`.star-template.${label}`) as HTMLDivElement
  divEl.style.display = 'initial'
}
