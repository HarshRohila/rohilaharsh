import './app.element.css'
import { makeDOMDriver } from '@cycle/dom'
import { run } from '@cycle/run'
import { withState } from '@cycle/state'
import { TodoApp } from './TodoApp'

export class AppElement extends HTMLElement {
  public static observedAttributes = []

  connectedCallback() {
    this.innerHTML = `
    <div id="app"></div>
    `

    const wrappedMain = withState(TodoApp)
    run(wrappedMain, drivers)
  }
}

// function main(sources) {
//   const coolInputSources = { DOM: sources.DOM }
//   const coolInput = isolate(CoolInput)(coolInputSources)

//   const myCoolVDom$ = coolInput.DOM

//   const isChecked$ = sources.DOM.select('input')
//     .events('click')
//     .map(ev => ev.target.checked)
//     .startWith(false)

//   const vdom$ = xs.combine(myCoolVDom$, isChecked$).map(([myCoolVDom, isChecked]) =>
//     div([
//       myCoolVDom,
//       // prettier-ignore
//       div([
//           input('.check', { attrs: { type: 'checkbox' } }),
//           p(isChecked ? 'ON' : 'off')
//         ])
//     ])
//   )

//   const sinks = {
//     DOM: vdom$
//   }
//   return sinks
// }

// function TodoApp(sources) {
//   // const renderTodos = () =>
//   //   ['first', 'second'].map(i =>
//   //     // prettier-ignore
//   //     li(i)
//   //   )

//   const input$ = sources.DOM.select('.input')
//     .events('input')
//     .map(ev => ev.target.value)
//     .remember()

//   const add$ = sources.DOM.select('.add-btn').events('click')

//   const todos$ = add$
//     .map(() => input$)
//     .flatten()
//     .startWith('')

//   const state$ = xs
//     .combine(todos$, input$)
//     .map(([todos, uInput]) => {
//       return {
//         todos,
//         uInput: uInput
//       } as { todos: string[]; uInput: string }
//     })
//     .startWith({
//       todos: [],
//       uInput: ''
//     })
//     .debug('test')

//   const vdom$ = state$.map(({ todos, uInput }) =>
//     // prettier-ignore
//     div([
//         input('.input', { attrs: { type: 'text' } }),
//         button('.add-btn', { attrs: {disabled: !uInput.length}}, 'Add'),
//         ul([
//           li('hello')
//         ])
//       ])
//   )

//   const sinks = {
//     DOM: vdom$
//   }

//   return sinks
// }

const drivers = {
  DOM: makeDOMDriver('#app')
}

customElements.define('rohilaharsh-root', AppElement)
