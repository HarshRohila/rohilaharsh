import './app.element.css'
import { makeDOMDriver } from '@cycle/dom'
import { run } from '@cycle/run'
import Snabbdom from 'snabbdom-pragma'

export class AppElement extends HTMLElement {
  public static observedAttributes = []

  connectedCallback() {
    this.innerHTML = `
    <div id="app">Hello</div>
    `
    console.log(Snabbdom)
    run(main, drivers)
  }
}

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('input')
      .events('click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled => (
        <div>
          <input type="checkbox" /> Toggle me
          <p>{toggled ? 'ON' : 'off'}</p>
        </div>
      ))
  }
  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

customElements.define('rohilaharsh-root', AppElement)
