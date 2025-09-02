// src/mirage.ts
import { createServer, Model, Factory, Response } from 'miragejs';

export function makeServer() {
  return createServer({
    models: {
      article: Model.extend<Partial<{
        title: string;
        status: string;
        author: string;
        createdAt: string;
      }>>({})
    },
    factories: {
      article: Factory.extend({
        title(i: number) { return `Sample Article ${i + 1}`; },
        status() { return Math.random() < 0.5 ? 'Published' : 'Draft'; },
        author() { return 'Jane Doe'; },
        createdAt() { return new Date().toISOString(); }
      })
    },
    seeds(server) {
      server.createList('article', 50);
    },
    routes() {
      this.namespace = 'api';

      this.get('/articles', async (schema, request) => {
        console.log(request.queryParams);

        await new Promise(resolve => setTimeout(resolve, 1000));
        if (Math.random() < 0.2) {
            //return new Response(500, {}, { error: 'Failed to load articles. Please try again.' });
        }

        const page = Number(request.queryParams.page) || 1;
        const pageSize = Number(request.queryParams.pageSize) || 10;
        let articles = schema.all('article').models;
        const search = request.queryParams.search;
        if (search) {
          articles = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
        }
        const total = articles.length;
        const totalPageNum = Math.ceil(total / pageSize);
        const paged = articles.slice((page - 1) * pageSize, page * pageSize);
        return { articles: paged, totalPageNum };
      });

      this.post('/articles', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('article', attrs);
      });

      this.put('/articles/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.find('article', id)?.update(attrs);
      });

      this.del('/articles/:id', (schema, request) => {
        const id = request.params.id;
        return schema.find('article', id)?.destroy();
      });
    }
  });
}
