import { createServer, Model } from 'miragejs';
import { API_URL } from '../utils/constants';
import factories from './factories';

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,

    models: {
      mail: Model,
    },

    factories,

    seeds(server) {
      server.createList('mail', 50);
    },

    routes() {
      this.urlPrefix = API_URL;

      this.get('mails');
      this.patch('mails/:id');
    },
  });
}
