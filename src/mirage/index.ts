import { createServer, Model } from 'miragejs';
import factories from './factories';

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,

    models: {
      mail: Model,
    },

    factories,

    seeds(server) {
      server.createList('mail', 10);
    },

    routes() {
      this.namespace = 'api';

      this.get('mails');
    },
  });
}
