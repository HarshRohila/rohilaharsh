import './app.element.css'
import { h1, makeDOMDriver } from '@cycle/dom'
import { run } from '@cycle/run'
import xs from 'xstream'

export class AppElement extends HTMLElement {
  public static observedAttributes = []

  connectedCallback() {
    // const title = 'cycle-js-test'

    this.innerHTML = `
    <div id="app">Hello</div>
    `
    run(main, drivers)
  }
}

function main() {
  const sinks = {
    DOM: xs.periodic(1000).map(i => h1('' + i + ' seconds elapsed'))
  }
  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

customElements.define('rohilaharsh-root', AppElement)
