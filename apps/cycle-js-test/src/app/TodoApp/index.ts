import { button, div, DOMSource, li, ul, VNode } from '@cycle/dom'
import { Reducer, StateSource } from '@cycle/state'
import xs, { Stream } from 'xstream'
import { CoolInput } from '../CoolInput'
import isolate from '@cycle/isolate'
import { BodyDOMSource } from '@cycle/dom/lib/cjs/BodyDOMSource'

interface State {
  todos: string[]
  input: {
    uInput: string
  }
}

interface Sources {
  DOM: DOMSource
  state: StateSource<State>
}

interface Sinks {
  DOM: Stream<VNode>
  state: Stream<Reducer<State>>
}

export function TodoApp(sources: Sources): Sinks {
  const coolInput = isolate(CoolInput, 'input')(sources)

  const add$ = (sources.DOM.select('.add-btn') as BodyDOMSource).events('click')

  const defaultReducer$ = xs.of(function defaultReducer(prevState: undefined | State) {
    if (typeof prevState === 'undefined') {
      return { todos: [], input: { uInput: '' } }
    } else {
      return prevState
    }
  }) as Stream<Reducer<State>>

  const updateReducer$ = add$.map(
    () =>
      function addReducer(prevState: State) {
        return {
          ...prevState,
          todos: [...prevState.todos, prevState.input.uInput]
        }
      }
  )

  const parentReducer$ = xs.merge(defaultReducer$, updateReducer$)
  const reducer$ = xs.merge(parentReducer$, coolInput.state as Stream<Reducer<State>>)

  const inputVdom$ = coolInput.DOM

  const vdom$ = xs.combine(inputVdom$, sources.state.stream).map(([inputVdom, state]) =>
    // prettier-ignore
    div([
      inputVdom,
      button('.add-btn', {attrs: {disabled: !state.input.uInput.length}}, 'Add'),
      ul(state.todos.map(todo => li(todo)))
    ])
  )

  const sinks = {
    state: reducer$,
    DOM: vdom$
  }

  return sinks
}
