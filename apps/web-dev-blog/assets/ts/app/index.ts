const STORAGE_KEY = 'theme-preference'

function getPreferredTheme(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function setTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_KEY, theme)
}

setTheme(getPreferredTheme())

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    setTheme(e.matches ? 'dark' : 'light')
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme')
      setTheme(current === 'dark' ? 'light' : 'dark')
    })
  }
})
