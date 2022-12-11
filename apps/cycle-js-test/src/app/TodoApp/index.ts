import { button, div, DOMSource, VNode } from '@cycle/dom'
import { Reducer, StateSource } from '@cycle/state'
import xs, { Stream } from 'xstream'
import { CoolInput } from '../CoolInput'
import isolate from '@cycle/isolate'

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

  const defaultReducer$ = xs.of(function defaultReducer(prevState: undefined | State) {
    if (typeof prevState === 'undefined') {
      return { todos: [], input: { uInput: '' } }
    } else {
      return prevState
    }
  }) as Stream<Reducer<State>>

  const reducer$ = xs.merge(defaultReducer$, coolInput.state as Stream<Reducer<State>>)

  const inputVdom$ = coolInput.DOM

  const vdom$ = inputVdom$.map(inputVdom =>
    // prettier-ignore
    div([
      inputVdom,
      button('.add-btn', 'Add')
    ])
  )

  const sinks = {
    state: reducer$,
    DOM: vdom$
  }

  return sinks
}
