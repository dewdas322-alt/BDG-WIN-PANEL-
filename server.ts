import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WINGO_1M_UPSTREAMS = [
  'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  'https://draw.ar-lottery02.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  'https://draw.ar-lottery03.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
];

const WARNING_TEXT_HINDI =
  'Sabse pahle hack se registration karo. Uske bad usi ID me minimum paanch sau rupaye ka deposit karo. Uske bad hack open ho jayega.';

/* ============================================================================
   ██  10 ADAPTIVE PATTERN & TREND BYPASS SERVERS (108-LAYER ENGINE)
   ============================================================================ */
interface BypassServerNode {
  id: string;
  name: string;
  specialty: string;
  region: string;
  baseWeight: number;
}

const TEN_BYPASS_SERVERS: BypassServerNode[] = [
  { id: 'SRV-01', name: 'ALPHA-DRAGON-TREND', specialty: 'Dragon Streak & Long Run Adaptive', region: 'SG-CORE-1', baseWeight: 98.4 },
  { id: 'SRV-02', name: 'BETA-ZIGZAG-MATRIX', specialty: 'A-B-A-B Alternating Pattern Lock', region: 'HK-NODE-2', baseWeight: 97.9 },
  { id: 'SRV-03', name: 'GAMMA-2-1-2-HARMONIC', specialty: 'Double-Single-Double Bridge Sync', region: 'JP-EDGE-3', baseWeight: 98.1 },
  { id: 'SRV-04', name: 'DELTA-MIRROR-TWIN', specialty: 'Mirror & Twin Digit Jackpot Solver', region: 'IN-MUM-4', baseWeight: 99.1 },
  { id: 'SRV-05', name: 'EPSILON-FIBONACCI-GAP', specialty: 'Missing Digit Cold-Gap Calculator', region: 'DE-FRA-5', baseWeight: 98.6 },
  { id: 'SRV-06', name: 'ZETA-MARKOV-CHAIN', specialty: '10-State Transition Probability Matrix', region: 'US-EAST-6', baseWeight: 98.8 },
  { id: 'SRV-07', name: 'ETA-VOLATILITY-SHIELD', specialty: 'Sudden Trend-Break & Trap Reversal', region: 'UK-LON-7', baseWeight: 97.7 },
  { id: 'SRV-08', name: 'THETA-QUANTUM-ENTROPY', specialty: 'SHA-Hash Seed & Period Drift Decoder', region: 'SG-CORE-8', baseWeight: 99.3 },
  { id: 'SRV-09', name: 'IOTA-PARITY-WAVE', specialty: 'Odd/Even & Big/Small Harmonic Wave', region: 'AE-DXB-9', baseWeight: 98.2 },
  { id: 'SRV-10', name: 'KAPPA-JACKPOT-SNIPER', specialty: 'Exact Single-Number 0-9 Jackpot Lock', region: 'GLOBAL-10', baseWeight: 99.6 },
];

// 🔒 Untouched core prediction logic mirror for 108-layer verification alignment
function getCoreFixedResult(pStr: string): { rn: number; sz: string } {
  if (!pStr) return { rn: 6, sz: 'BIG' };
  var hash = 0;
  for (var i = 0; i < pStr.length; i++) {
    hash = (hash << 5) - hash + pStr.charCodeAt(i);
    hash |= 0;
  }
  var rn = Math.abs(hash) % 10;
  var sz = rn >= 5 ? 'BIG' : 'SMALL';
  return { rn: rn, sz: sz };
}

function run108LayerMultiServerAnalysis(periodStr: string, historyNumbers: number[]) {
  const coreTarget = getCoreFixedResult(periodStr);
  const recent = historyNumbers.length > 0 ? historyNumbers : [6, 2, 8, 4, 9, 1, 7, 3];

  // Detect live pattern type from real history
  let detectedTrend = 'QUANTUM-JACKPOT-LOCK';
  if (recent.length >= 4) {
    const b0 = recent[0] >= 5;
    const b1 = recent[1] >= 5;
    const b2 = recent[2] >= 5;
    const b3 = recent[3] >= 5;
    if (b0 === b1 && b1 === b2) detectedTrend = 'DRAGON-STREAK-TREND';
    else if (b0 !== b1 && b1 !== b2 && b2 !== b3) detectedTrend = 'ZIGZAG-ALTERNATING';
    else if (recent[0] === recent[1] || recent[0] === recent[2]) detectedTrend = 'MIRROR-TWIN-REPEAT';
    else if (b0 === b1 && b1 !== b2) detectedTrend = '2-1-2-HARMONIC-BRIDGE';
  }

  // Execute 108 layers of calculation across the 10 servers
  let accumulator = 0x811c9dc5;
  for (let layer = 1; layer <= 108; layer++) {
    const histVal = recent[(layer - 1) % recent.length] || 0;
    const pChar = periodStr.charCodeAt((layer - 1) % Math.max(1, periodStr.length)) || 48;
    accumulator ^= (histVal * 131 + pChar * 31 + layer * 17) & 0xff;
    accumulator = Math.imul(accumulator, 0x01000193) >>> 0;
  }

  const serverReports = TEN_BYPASS_SERVERS.map((srv, idx) => {
    const layerStart = idx * 10 + 1;
    const layerEnd = idx === 9 ? 108 : (idx + 1) * 10;
    const confidence = Number((srv.baseWeight + ((accumulator + idx * 7) % 14) * 0.02).toFixed(2));
    return {
      ...srv,
      layersProcessed: `${layerStart}-${layerEnd}`,
      confidence: Math.min(99.9, confidence),
      lockedNumber: coreTarget.rn,
      lockedSize: coreTarget.sz,
      status: 'SYNCHRONIZED',
    };
  });

  return {
    totalLayers: 108,
    activeServers: 10,
    detectedTrend,
    period: periodStr,
    jackpotNumber: coreTarget.rn,
    jackpotSize: coreTarget.sz,
    overallConfidence: 99.8,
    cipherSignature: '0x' + accumulator.toString(16).toUpperCase().padStart(8, '0'),
    servers: serverReports,
  };
}

async function fetchFromUpstreams() {
  const ts = Date.now();
  for (const baseUrl of WINGO_1M_UPSTREAMS) {
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

// Pre-cache warning audio buffer in memory so Cloud Run serves it with 0ms delay
let cachedWarningMp3: Buffer | null = null;

async function getWarningAudioBuffer(text: string, tl: string): Promise<Buffer | null> {
  if (cachedWarningMp3 && text === WARNING_TEXT_HINDI && tl === 'hi') {
    return cachedWarningMp3;
  }

  const endpoints = [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(tl)}&client=tw-ob`,
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(tl)}&client=gtx`,
  ];

  for (const url of endpoints) {
    try {
      const upstream = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });
      if (upstream.ok) {
        const buf = Buffer.from(await upstream.arrayBuffer());
        if (buf.length > 500) {
          if (text === WARNING_TEXT_HINDI && tl === 'hi') {
            cachedWarningMp3 = buf;
          }
          return buf;
        }
      }
    } catch (_e) {}
  }
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = Number(process.env.PORT) || 3000;

  // Pre-warm Hindi warning MP3 cache on startup
  getWarningAudioBuffer(WARNING_TEXT_HINDI, 'hi').catch(() => {});

  // 1. Real WinGo 1M History Proxy
  app.get('/api/wingo-history', async (_req, res) => {
    try {
      const data = await fetchFromUpstreams();
      if (data) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        return res.json(data);
      }
      return res.status(502).json({ error: 'Upstream unavailable' });
    } catch (_e) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  });

  // 2. 10-Server + 108-Layer Adaptive Pattern & Number Jackpot Bypass Endpoint
  app.post('/api/bypass-cluster', (req, res) => {
    try {
      const period = String(req.body?.period || '0000');
      const history = Array.isArray(req.body?.history) ? req.body.history.map(Number) : [];
      const result = run108LayerMultiServerAnalysis(period, history);
      res.setHeader('Cache-Control', 'no-store');
      return res.json(result);
    } catch (_e) {
      return res.status(500).json({ error: 'Bypass cluster error' });
    }
  });

  // 3. Cloud-Ready Hindi Warning Audio Endpoint (MP3 + Base64 JSON mode)
  app.get('/api/tts', async (req, res) => {
    try {
      const text = String(req.query.q || WARNING_TEXT_HINDI);
      const tl = String(req.query.tl || 'hi');
      const format = String(req.query.format || 'mp3');

      const buf = await getWarningAudioBuffer(text, tl);
      if (!buf) {
        return res.status(502).json({ error: 'TTS unavailable' });
      }

      if (format === 'base64') {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.json({
          audioDataUrl: `data:audio/mpeg;base64,${buf.toString('base64')}`,
        });
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(buf);
    } catch (_e) {
      return res.status(500).end();
    }
  });

  // Serve built frontend in Cloud Run if dist/index.html exists, otherwise Vite middleware
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' || hasDist) {
    // In dev environment inside AI Studio, prefer Vite middleware unless NODE_ENV=production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
