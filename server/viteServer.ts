import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { createServer } from 'vite';

export const createViteDevServer = async (
  cwd = path.resolve('../', 'bacon-front-vite'),
) => {
  if (!fs.existsSync(cwd)) throw new Error(`No such directory: ${cwd}`);
  const router = express.Router();

  const vite = await createServer({
    root: cwd,
    logLevel: 'info',
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  });

  router.use(vite.middlewares);

  router.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const html = fs.readFileSync(path.resolve(cwd, 'index.html'), 'utf-8');
      res
        .status(200)
        .set({ 'Content-Type': 'text/html' }) // eslint-disable-line
        .end(await vite.transformIndexHtml(url, html));
    } catch (e) {
      if (e instanceof Error) {
        vite && vite.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    }
  });

  return { router, vite };
};
