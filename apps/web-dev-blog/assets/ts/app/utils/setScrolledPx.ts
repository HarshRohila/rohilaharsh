let ticking = false

function setScrolledPx() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolledPx = window.scrollY
      document.documentElement.style.setProperty('--scrolled-px', scrolledPx.toString())
      ticking = false
    })
    ticking = true
  }
}

export { setScrolledPx }
