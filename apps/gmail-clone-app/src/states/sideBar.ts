import { createStore } from '@stencil/store'
export { SideBar }
const { state } = createStore({
  isOpen: getState()
})

const SideBar = {
  toggle() {
    state.isOpen = !state.isOpen
  },
  state
}

function getState() {
  return document.body.clientWidth > 600
}

window.addEventListener('resize', () => {
  SideBar.state.isOpen = getState()
})
