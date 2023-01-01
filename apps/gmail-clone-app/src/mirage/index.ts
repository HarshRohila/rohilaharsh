import { camelize } from '@orbit/serializers'
import { createServer, JSONAPISerializer, Model } from 'miragejs'
import { API_URL } from '../utils/constants'
import factories from './factories'

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,

    serializers: {
      application: JSONAPISerializer.extend({
        keyForAttribute(attr) {
          return camelize(attr)
        }
      })
    },

    models: {
      mail: Model
    },

    factories,

    seeds(server) {
      server.createList('mail', 50)
    },

    routes() {
      this.urlPrefix = API_URL

      this.get('mails')
      this.get('mails/:id')
      this.patch('mails/:id')
      this.delete('mails/:id')
      this.post('mails')
    }
  })
}
