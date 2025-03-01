import { setScrolledPx } from './utils/setScrolledPx'

function setHeaderHeight() {
  const headerHeight = document.querySelector('header')!.clientHeight
  document.documentElement.style.setProperty('--header-height', headerHeight.toString())
}

// Set Scrolled Pixels
window.addEventListener('scroll', setScrolledPx)
window.addEventListener('resize', setScrolledPx)
setScrolledPx()

// Set Header Height
window.addEventListener('resize', setHeaderHeight)
setHeaderHeight()
