import { button, DOMSource, form, li, span, ul, VNode } from '@cycle/dom'
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

  const add$ = (sources.DOM.select('form') as BodyDOMSource).events('submit').map(ev => {
    ev.preventDefault()
    return ev
  })

  const defaultReducer$ = xs.of(function defaultReducer(prevState: undefined | State) {
    if (typeof prevState === 'undefined') {
      return { todos: [], input: { uInput: '' } }
    } else {
      return prevState
    }
  }) as Stream<Reducer<State>>

  const updateReducer$ = add$.map(
    () =>
      function addReducer(prevState: State): State {
        return {
          ...prevState,
          todos: [...prevState.todos, prevState.input.uInput],
          input: {
            uInput: ''
          }
        }
      }
  )

  const delete$ = (sources.DOM.select('.del-btn') as BodyDOMSource).events('click')

  const deleteReducer$ = delete$
    .map(ev => (ev.target as HTMLButtonElement).getAttribute('data-id'))
    .map(
      id =>
        function deleteTodo(prevState: State): State {
          const newTodos = [...prevState.todos]
          newTodos.splice(+id, 1)

          return {
            ...prevState,
            todos: newTodos
          }
        }
    )

  const parentReducer$ = xs.merge(defaultReducer$, updateReducer$, deleteReducer$)
  const reducer$ = xs.merge(parentReducer$, coolInput.state as Stream<Reducer<State>>)

  const inputVdom$ = coolInput.DOM

  const vdom$ = xs.combine(inputVdom$, sources.state.stream).map(([inputVdom, state]) =>
    // prettier-ignore
    form([
      inputVdom,
      button('.add-btn', {attrs: {disabled: !state.input.uInput.length, type:'submit'}}, 'Add'),
      ul(state.todos.map((todo, index) => renderTodo(todo, index)))
    ])
  )

  const sinks = {
    state: reducer$,
    DOM: vdom$
  }

  return sinks
}

function renderTodo(todo: string, id: number) {
  // prettier-ignore
  return li([
    span(todo), 
    button('.del-btn', { attrs: { 'data-id': id , type: 'button'} }, 'X')
  ])
}
