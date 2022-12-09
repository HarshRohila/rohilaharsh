import './app.element.css'
import { div, input, makeDOMDriver, p } from '@cycle/dom'
import { run } from '@cycle/run'
import isolate from '@cycle/isolate'
import xs from 'xstream'

export class AppElement extends HTMLElement {
  public static observedAttributes = []

  connectedCallback() {
    this.innerHTML = `
    <div id="app"></div>
    `
    run(main, drivers)
  }
}

function main(sources) {
  const coolInputSources = { DOM: sources.DOM }
  const coolInput = isolate(CoolInput)(coolInputSources)

  const myCoolVDom$ = coolInput.DOM

  const isChecked$ = sources.DOM.select('input')
    .events('click')
    .map(ev => ev.target.checked)
    .startWith(false)

  const vdom$ = xs.combine(myCoolVDom$, isChecked$).map(([myCoolVDom, isChecked]) =>
    div([
      myCoolVDom,
      // prettier-ignore
      div([
          input('.check', { attrs: { type: 'checkbox' } }), 
          p(isChecked ? 'ON' : 'off')
        ])
    ])
  )

  const sinks = {
    DOM: vdom$
  }
  return sinks
}

function CoolInput(sources) {
  const sinks = {
    DOM: sources.DOM.select('.harsh')
      .events('input')
      .map(ev => ev.target.value)
      .startWith('')
      .map(text =>
        // prettier-ignore
        div([
          input('.harsh', {attrs: {type: 'text'}}),
          p(text)
        ])
      )
  }
  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

customElements.define('rohilaharsh-root', AppElement)
