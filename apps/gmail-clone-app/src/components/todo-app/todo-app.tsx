import { Component, h, State } from '@stencil/core'
import tillDestroyed from '../../utils/untilDestroyed'
import todosFacade, { Todo } from './todos-facade'

@Component({
  tag: 'todo-app',
  styleUrl: 'todo-app.scss',
  shadow: true
})
export class TodoApp {
  @State() todos: Todo[] = []

  componentWillLoad() {
    todosFacade.loadTodos().pipe(tillDestroyed(this)).subscribe()

    todosFacade
      .selectTodos()
      .pipe(tillDestroyed(this))
      .subscribe({
        next: todos => {
          this.todos = todos
        }
      })
  }

  disconnectedCallback() {
    return undefined
  }

  private handleDelete = (todo: Todo) => {
    todosFacade.deleteTodo(todo).pipe(tillDestroyed(this)).subscribe()
  }

  private createDeleteHandler = (todo: Todo) => {
    return () => {
      this.handleDelete(todo)
    }
  }

  render() {
    return (
      <ul>
        {this.todos.map(t => (
          <li>
            {t.text}
            <button onClick={this.createDeleteHandler(t)}>X</button>
          </li>
        ))}
      </ul>
    )
  }
}
