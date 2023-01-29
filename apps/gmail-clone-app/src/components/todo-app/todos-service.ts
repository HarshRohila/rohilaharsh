import { store } from '../../orbitjs'
import { Todo } from './todos-facade'

class TodosService {
  async getTodos(): Promise<Todo[]> {
    const response = await store.query(q => q.findRecords('todo'))

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const todos = response.map(deserialize)

    return todos
  }

  async deleteTodo(todo: Todo) {
    await store.update(t => {
      return [todo.id].map(id => {
        const record = { type: 'todo', id }
        return t.removeRecord(record)
      })
    })
  }
}

function deserialize(emailJsonApiRecord: any) {
  const mail = emailJsonApiRecord
  mail.attributes.id = mail.id
  return mail.attributes
}

const todosService = new TodosService()

export default todosService
