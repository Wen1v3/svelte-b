import { makeServer } from './mirage';

if (import.meta.env.DEV) {
  makeServer();
}
