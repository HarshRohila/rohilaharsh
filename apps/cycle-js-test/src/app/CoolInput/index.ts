import { div, DOMSource, input, p, VNode } from '@cycle/dom'
import { BodyDOMSource } from '@cycle/dom/lib/cjs/BodyDOMSource'
import { Reducer, StateSource } from '@cycle/state'
import xs, { MemoryStream, Stream } from 'xstream'

interface State {
  uInput: string
}

interface Sources {
  DOM: DOMSource
  state: StateSource<State>
}

interface Sinks {
  DOM: Stream<VNode>
  state: Stream<Reducer<State>>
}

export function CoolInput(sources: Sources): Sinks {
  const actions = intent(sources.DOM)

  const reducer$ = reducer(actions)

  const vdom$ = view(sources.state.stream)

  const sinks = {
    state: reducer$,
    DOM: vdom$
  }

  return sinks
}

function reducer(actions: { uInput$: Stream<string> }) {
  const defaultReducer$ = xs.of(function defaultReducer(prevState: undefined | State) {
    if (typeof prevState === 'undefined') {
      return { uInput: '' }
    } else {
      return prevState
    }
  })

  const updateReducer$ = actions.uInput$.map(
    i =>
      function addOneReducer(prevState: State) {
        return {
          ...prevState,
          uInput: i
        }
      }
  )

  const reducer$ = xs.merge(defaultReducer$, updateReducer$)
  return reducer$
}

function intent(domSource: DOMSource) {
  return {
    uInput$: (domSource.select('.harsh') as BodyDOMSource)
      .events('input')
      .map(ev => (ev.target as HTMLInputElement).value)
  }
}

function view(state$: MemoryStream<State>) {
  return state$
    .map((s: State) => s.uInput)
    .debug('test')
    .map(text =>
      // prettier-ignore
      div([
        input('.harsh', {attrs: {type: 'text'}}),
        p(text)
      ])
    )
}
