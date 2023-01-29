import { newSpecPage } from '@stencil/core/testing'
import { take } from 'rxjs'
import { TodoApp } from './todo-app'
import todosFacade, { Todo } from './todos-facade'
import todosService from './todos-service'

describe('todo-facade', () => {
  describe('loadTodos', () => {
    const mockTodos: Todo[] = [{ id: '1', text: 'harsh' }]
    todosService.getTodos = jest.fn().mockResolvedValue(mockTodos)
    todosService.deleteTodo = jest.fn().mockResolvedValue(undefined)

    it('it calls API to load todos', done => {
      todosFacade
        .loadTodos()
        .pipe(take(1))
        .subscribe({
          complete: () => {
            todosFacade
              .selectTodos()
              .pipe(take(1))
              .subscribe({
                next: state => {
                  expect(state).toStrictEqual([{ id: '1', text: 'harsh' }])
                },
                complete: done
              })
          }
        })
    })
  })

  it('deleteTodos works', done => {
    todosFacade.updateState({
      todos: [
        { id: '1', text: 'harsh' },
        { id: '2', text: 'rohila' }
      ]
    })
    todosFacade
      .deleteTodo({ id: '1', text: 'harsh' })
      .pipe(take(1))
      .subscribe({
        complete: () => {
          todosFacade
            .selectTodos()
            .pipe(take(1))
            .subscribe({
              next: state => {
                expect(state).toStrictEqual([{ id: '2', text: 'rohila' }])
              },
              complete: done
            })
        }
      })
  })
})

async function renderComponent() {
  const page = await newSpecPage({
    components: [TodoApp],
    html: '<todo-app></todo-app>'
  })

  return { page }
}
