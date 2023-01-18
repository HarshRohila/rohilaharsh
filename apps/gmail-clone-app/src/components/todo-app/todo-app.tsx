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
      .subscribe(todos => {
        this.todos = todos
      })
  }

  disconnectedCallback() {
    return undefined
  }

  render() {
    return (
      <ul>
        {this.todos.map(t => (
          <li>{t.text}</li>
        ))}
      </ul>
    )
  }
}
