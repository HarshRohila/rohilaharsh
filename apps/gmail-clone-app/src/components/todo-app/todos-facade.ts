import { BehaviorSubject, defer, map, tap } from 'rxjs'
import todosService from './todos-service'

class TodosFacade {
  state$: BehaviorSubject<State>

  constructor() {
    this.state$ = new BehaviorSubject<State>({ todos: [] })
  }

  loadTodos() {
    return defer(() => todosService.getTodos()).pipe(
      tap(todos => {
        this.state$.next({ todos })
      })
    )
  }

  selectTodos() {
    return this.state$.pipe(map(s => s.todos))
  }

  deleteTodo(todo: Todo) {
    return defer(() => todosService.deleteTodo(todo)).pipe(
      tap(() => {
        this.state$.next({ todos: this.state$.value.todos.filter(t => t.id !== todo.id) })
      })
    )
  }

  updateState(state: State) {
    this.state$.next({ ...this.state$.value, ...state })
  }
}

interface State {
  todos: Todo[]
}

export interface Todo {
  id: string
  text: string
}

const todosFacade = new TodosFacade()

export default todosFacade
