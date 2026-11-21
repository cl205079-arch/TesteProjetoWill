import express from 'express';

export class Application {
  readonly http = express();

  constructor() {
    this.http.disable('x-powered-by');
    this.http.get('/health', (_request, response) => {
      response.json({ status: 'ok' });
    });
  }
}
