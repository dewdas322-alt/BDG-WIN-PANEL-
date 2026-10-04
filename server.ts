import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WINGO_1M_UPSTREAMS = [
  'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  'https://draw.ar-lottery02.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  'https://draw.ar-lottery03.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
];

async function fetchFromUpstreams() {
  const ts = Date.now();
  for (const baseUrl of WINGO_1M_UPSTREAMS) {
    // Try GET with query params first (standard ar-lottery format)
    try {
      const getUrl = `${baseUrl}?ts=${ts}&pageSize=10&pageNo=1&type=1`;
      const resGet = await fetch(getUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
          Referer: 'https://bdgwin78.com/',
          Origin: 'https://bdgwin78.com',
        },
      });
      if (resGet.ok) {
        const data = await resGet.json();
        if (data && (data.data || data.list)) return data;
      }
    } catch (_e) {}

    // Try POST form-urlencoded
    try {
      const resPost = await fetch(`${baseUrl}?ts=${ts}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/plain, */*',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
          Referer: 'https://bdgwin78.com/',
          Origin: 'https://bdgwin78.com',
        },
        body: 'pageSize=10&pageNo=1&type=1',
      });
      if (resPost.ok) {
        const data = await resPost.json();
        if (data && (data.data || data.list)) return data;
      }
    } catch (_e) {}
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy route for real WinGo 1M game history (bypasses browser CORS)
  app.get('/api/wingo-history', async (_req, res) => {
    try {
      const data = await fetchFromUpstreams();
      if (data) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        return res.json(data);
      }
      return res.status(502).json({ error: 'Upstream unavailable' });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  });

  // Proxy route for Hindi warning voice TTS (bypasses browser CORS / ORB restrictions)
  app.get('/api/tts', async (req, res) => {
    try {
      const text = String(
        req.query.q ||
          'Sabse pahle hack se registration karo. Uske bad usi ID me minimum paanch sau rupaye ka deposit karo. Uske bad hack open ho jayega.'
      );
      const tl = String(req.query.tl || 'hi');
      const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${encodeURIComponent(tl)}&client=tw-ob`;

      const upstream = await fetch(ttsUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });

      if (!upstream.ok) {
        return res.status(upstream.status).end();
      }

      const arrayBuf = await upstream.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(Buffer.from(arrayBuf));
    } catch (_e) {
      return res.status(500).end();
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
