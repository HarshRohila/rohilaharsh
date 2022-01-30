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
      server.createList('mail', 10);
    },

    routes() {
      this.urlPrefix = API_URL;

      this.get('mails');
    },
  });
}
