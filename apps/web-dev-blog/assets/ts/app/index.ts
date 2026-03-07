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

  const menuToggle = document.getElementById('mobile-menu-toggle')
  const overlay = document.getElementById('mobile-nav-overlay')

  if (menuToggle && overlay) {
    menuToggle.addEventListener('click', () => {
      const isOpen = overlay.classList.contains('open')
      if (isOpen) {
        closeMenu(overlay, menuToggle)
      } else {
        overlay.style.display = 'block'
        requestAnimationFrame(() => overlay.classList.add('open'))
        menuToggle.setAttribute('aria-expanded', 'true')
        document.body.style.overflow = 'hidden'
      }
    })

    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu(overlay, menuToggle))
    })

    document.addEventListener('click', (e) => {
      if (
        overlay.classList.contains('open') &&
        !overlay.contains(e.target as Node) &&
        !menuToggle.contains(e.target as Node)
      ) {
        closeMenu(overlay, menuToggle)
      }
    })
  }
})

function closeMenu(overlay: HTMLElement, toggle: HTMLElement) {
  overlay.classList.remove('open')
  toggle.setAttribute('aria-expanded', 'false')
  document.body.style.overflow = ''
  setTimeout(() => {
    if (!overlay.classList.contains('open')) {
      overlay.style.display = 'none'
    }
  }, 300)
}
