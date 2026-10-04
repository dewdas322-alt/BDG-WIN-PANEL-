/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ============================================================================
   ██  CONFIG & CONSTANTS
   ============================================================================ */
const ADMIN_NUMBER = '655675576694'; // 12-digit Admin Master Number — bypasses register/deposit
const REFERRAL_URL = 'https://bdgwin78.com/#/register?invitationCode=4148715921265';
const API_ENDPOINT_1M_DIRECT = 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json';

const BALL_IMAGES: Record<number, string> = {
  0: 'https://i.ibb.co/zTqVhNm3/num-0.png',
  1: 'https://i.ibb.co/rKF3NVcK/num-1.png',
  2: 'https://i.ibb.co/DPt33g7S/num-2.png',
  3: 'https://i.ibb.co/chv1dYvJ/num-3.png',
  4: 'https://i.ibb.co/7xnpHkmD/num-4.png',
  5: 'https://i.ibb.co/B5mT5NjL/num-5.png',
  6: 'https://i.ibb.co/DH2YsSTC/num-6.png',
  7: 'https://i.ibb.co/9mmP3W3M/num-7.png',
  8: 'https://i.ibb.co/zHDjj6v4/num-8.png',
  9: 'https://i.ibb.co/SXwd01w9/num-9.png',
};

interface UserRecord {
  registered: boolean;
  deposit: number;
  name: string;
  viaLink?: boolean;
}

const VERIFIED_REFERRAL_USERS: Record<string, UserRecord> = {
  '9876543210': { registered: true, deposit: 750, name: 'VIP Member', viaLink: true },
  '9123456780': { registered: true, deposit: 1200, name: 'Pro Player', viaLink: true },
  '9000000001': { registered: true, deposit: 200, name: 'Low Deposit User', viaLink: true },
  '8888888888': { registered: false, deposit: 500, name: 'Unregistered', viaLink: false },
};

/* ============================================================================
   ██  🔒 PREDICTION CORE — 100% UNTOUCHED (DO NOT MODIFY)
   ============================================================================ */
function getFixedResultForPeriod(pStr: string): { rn: number; sz: string } {
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

/* ============================================================================
   ██  55-LAYER MILITARY-GRADE SYMMETRIC CIPHER ENGINE
   ============================================================================ */
const CIPHER_LAYERS = 55;
const CIPHER_MASTER_SEED =
  0x5f3759df ^ (typeof navigator !== 'undefined' ? navigator.userAgent.length * 7919 : 31337);

function deriveLayerKey(seed: number, layerIdx: number): number[] {
  let h = (seed ^ Math.imul(layerIdx + 1, 0x9e3779b1)) >>> 0;
  const keyBytes: number[] = [];
  for (let j = 0; j < 32; j++) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    keyBytes.push((h >>> 16) & 0xff);
  }
  return keyBytes;
}

function encryptL55(payloadObj: unknown): string | null {
  try {
    const rawJson = JSON.stringify(payloadObj);
    const encoder = new TextEncoder();
    const bytes = Array.from(encoder.encode(rawJson));

    for (let layer = 0; layer < CIPHER_LAYERS; layer++) {
      const key = deriveLayerKey(CIPHER_MASTER_SEED, layer);
      const mode = layer % 4;

      if (mode === 0) {
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = (bytes[i] ^ key[i % key.length] ^ ((i * 13 + layer) & 0xff)) & 0xff;
        }
      } else if (mode === 1) {
        const shift = (key[0] + (layer + 1) * 37) & 0xff;
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = (bytes[i] + shift + key[(i + layer) % key.length]) & 0xff;
        }
      } else if (mode === 2) {
        bytes.reverse();
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = (bytes[i] ^ key[(bytes.length - 1 - i) % key.length]) & 0xff;
        }
      } else {
        for (let i = 0; i < bytes.length; i++) {
          const b = bytes[i];
          const swapped = ((b & 0x0f) << 4) | ((b & 0xf0) >> 4);
          bytes[i] = (swapped ^ key[i % key.length]) & 0xff;
        }
      }
    }

    const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    return 'L55$' + btoa(hex);
  } catch (_e) {
    return null;
  }
}

function decryptL55<T = any>(cipherText: string): T | null {
  try {
    if (!cipherText || !cipherText.startsWith('L55$')) return null;
    const hex = atob(cipherText.slice(4));
    if (hex.length % 2 !== 0) return null;

    const bytes: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }

    for (let layer = CIPHER_LAYERS - 1; layer >= 0; layer--) {
      const key = deriveLayerKey(CIPHER_MASTER_SEED, layer);
      const mode = layer % 4;

      if (mode === 0) {
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = (bytes[i] ^ key[i % key.length] ^ ((i * 13 + layer) & 0xff)) & 0xff;
        }
      } else if (mode === 1) {
        const shift = (key[0] + (layer + 1) * 37) & 0xff;
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = (bytes[i] - shift - key[(i + layer) % key.length] + 512) & 0xff;
        }
      } else if (mode === 2) {
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = (bytes[i] ^ key[(bytes.length - 1 - i) % key.length]) & 0xff;
        }
        bytes.reverse();
      } else {
        for (let i = 0; i < bytes.length; i++) {
          const unxored = (bytes[i] ^ key[i % key.length]) & 0xff;
          bytes[i] = ((unxored & 0x0f) << 4) | ((unxored & 0xf0) >> 4);
        }
      }
    }

    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(new Uint8Array(bytes));
    return JSON.parse(jsonStr) as T;
  } catch (_e) {
    return null;
  }
}

function makeChecksum(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 >>> 0).toString(36) + '_' + (h2 >>> 0).toString(36);
}

/* ============================================================================
   ██  SESSION & REFERRAL TRACKING (55-Layer Encrypted)
   ============================================================================ */
const SESSION_KEY = 'bdgwin_sess_l55_v3';
const REF_CLICK_KEY = 'bdgwin_ref_click_l55_v3';
const HUD_POS_KEY = 'bdgwin_hud_pos_v2';
const PANEL_POS_KEY = 'bdgwin_panel_pos_v2';

interface SessionData {
  mobile: string;
  name: string;
  deposit: number;
  master: boolean;
  ts: number;
  nonce: string;
  checksum: string;
}

function saveSession(user: { mobile: string; name?: string; deposit?: number; master?: boolean }) {
  try {
    const ts = Date.now();
    const nonce = Math.random().toString(36).slice(2);
    const master = !!user.master;
    const checksum = makeChecksum(`${user.mobile}|${master ? '1' : '0'}|${ts}|${nonce}`);
    const payload: SessionData = {
      mobile: user.mobile,
      name: user.name || 'USER',
      deposit: user.deposit || 0,
      master,
      ts,
      nonce,
      checksum,
    };
    const cipher = encryptL55(payload);
    if (cipher) localStorage.setItem(SESSION_KEY, cipher);
  } catch (_e) {}
}

function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = decryptL55<SessionData>(raw);
    if (!s || !s.mobile || !s.nonce) return null;
    const expected = makeChecksum(`${s.mobile}|${s.master ? '1' : '0'}|${s.ts}|${s.nonce}`);
    if (s.checksum !== expected) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    if (Date.now() - (s.ts || 0) > 30 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch (_e) {
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (_e) {}
}

function markReferralLinkOpened() {
  try {
    const token = encryptL55({ clicked: true, code: '4148715921265', ts: Date.now() });
    if (token) localStorage.setItem(REF_CLICK_KEY, token);
  } catch (_e) {}
}

function hasOpenedReferralLink(): boolean {
  try {
    const raw = localStorage.getItem(REF_CLICK_KEY);
    if (!raw) return false;
    const data = decryptL55<{ clicked: boolean; code: string; ts: number }>(raw);
    return !!(data && data.clicked && data.code === '4148715921265');
  } catch (_e) {
    return false;
  }
}

/* ============================================================================
   ██  ONLY WARNING AUDIO ENGINE (NO OTHER SOUNDS OR BEEPS)
   ============================================================================
   Strictly plays ONLY the Hindi registration + ₹500 deposit warning audio
   when an unverified user tries to verify or execute. No other sound effects
   or voice lines are played anywhere else.
   ============================================================================ */
const WARNING_TEXT =
  'Sabse pahle hack se registration karo. Uske bad usi ID me minimum paanch sau rupaye ka deposit karo. Uske bad hack open ho jayega.';

let activeWarningAudio: HTMLAudioElement | null = null;
let lastWarnTs = 0;

function playAudioWarning() {
  const now = Date.now();
  if (now - lastWarnTs < 1000) return;
  lastWarnTs = now;

  // 1. Native Android/WebView bridge if present
  const win = window as unknown as { TeamBridge?: { speak?: (t: string) => void } };
  if (win.TeamBridge && typeof win.TeamBridge.speak === 'function') {
    try {
      win.TeamBridge.speak(WARNING_TEXT);
    } catch (_e) {}
  }

  let spokeViaWebSpeech = false;

  // 2. Browser SpeechSynthesis API (Hindi voice)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      if (synth.paused) synth.resume();

      const utter = new SpeechSynthesisUtterance(WARNING_TEXT);
      utter.lang = 'hi-IN';
      utter.rate = 0.92;
      utter.pitch = 1.0;
      utter.volume = 1.0;

      const voices = synth.getVoices() || [];
      const hiVoice =
        voices.find((v) => (v.lang || '').toLowerCase() === 'hi-in') ||
        voices.find((v) => (v.lang || '').toLowerCase().startsWith('hi')) ||
        voices.find((v) => (v.lang || '').toLowerCase().includes('en-in')) ||
        voices[0];

      if (hiVoice) utter.voice = hiVoice;

      utter.onstart = () => {
        spokeViaWebSpeech = true;
      };

      utter.onerror = () => {
        if (!spokeViaWebSpeech) playServerTtsWarning();
      };

      synth.speak(utter);

      // Fallback to server-proxied Hindi TTS MP3 if WebSpeech doesn't start within 450ms
      setTimeout(() => {
        if (!spokeViaWebSpeech && !synth.speaking) {
          playServerTtsWarning();
        }
      }, 450);
      return;
    } catch (_e) {}
  }

  // 3. Direct Server-Proxied Hindi TTS Audio
  playServerTtsWarning();
}

function playServerTtsWarning() {
  try {
    if (activeWarningAudio) {
      activeWarningAudio.pause();
      activeWarningAudio = null;
    }
    const audio = new Audio(`/api/tts?tl=hi&q=${encodeURIComponent(WARNING_TEXT)}`);
    audio.volume = 1.0;
    activeWarningAudio = audio;
    audio.play().catch(() => {});
  } catch (_e) {}
}

/* ============================================================================
   ██  PERIOD CALCULATION — STRICTLY 1-MINUTE PERIODS ONLY
   ============================================================================ */
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function getOneMinutePeriod(): string {
  const d = new Date();
  const utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  const dateStr = utc.getFullYear() + pad2(utc.getMonth() + 1) + pad2(utc.getDate());
  const totalMins = utc.getHours() * 60 + utc.getMinutes();
  return dateStr + String(10001 + totalMins);
}

/* ============================================================================
   ██  MAIN APPLICATION COMPONENT
   ============================================================================ */
type ViewMode = 'locked' | 'ready' | 'loader' | 'result';

interface LiveHistoryItem {
  issue: string;
  number: number;
}

export default function App() {
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('locked');
  const [mobileInput, setMobileInput] = useState<string>('');
  const [lockError, setLockError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [shakeBox, setShakeBox] = useState<boolean>(false);

  const [walletBalance, setWalletBalance] = useState<number>(9999.0);
  const [periodStr, setPeriodStr] = useState<string>(() => getOneMinutePeriod().slice(-4));
  const [secondsLeft, setSecondsLeft] = useState<number>(() => 60 - new Date().getSeconds());
  const [liveOnline, setLiveOnline] = useState<boolean>(false);
  const [liveHistory, setLiveHistory] = useState<LiveHistoryItem[]>([]);

  // Loader state
  const [loaderProgress, setLoaderProgress] = useState<number>(0);
  const [loaderHex, setLoaderHex] = useState<string>('0x0000');
  const [loaderStageText, setLoaderStageText] = useState<string>('BYPASSING...');

  // Result state
  const [resultData, setResultData] = useState<{ rn: number; sz: string; period: string }>({
    rn: 6,
    sz: 'BIG',
    period: '0000',
  });

  // Mini launcher position
  const [hudPos, setHudPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HUD_POS_KEY) || 'null');
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
        return saved;
      }
    } catch (_e) {}
    return {
      x: typeof window !== 'undefined' ? Math.max(12, window.innerWidth - 82) : 20,
      y: typeof window !== 'undefined' ? Math.max(20, Math.floor(window.innerHeight * 0.62)) : 120,
    };
  });

  // Full Floating HUD Panel position (smoothly draggable across the whole screen just like the logo)
  const [panelPos, setPanelPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PANEL_POS_KEY) || 'null');
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
        return saved;
      }
    } catch (_e) {}
    return {
      x: typeof window !== 'undefined' ? Math.max(0, Math.floor((window.innerWidth - 340) / 2)) : 20,
      y: typeof window !== 'undefined' ? Math.max(10, Math.floor((window.innerHeight - 340) / 2)) : 60,
    };
  });

  const [isDraggingPanel, setIsDraggingPanel] = useState<boolean>(false);
  const [isDraggingMini, setIsDraggingMini] = useState<boolean>(false);

  const liveIssueNoRef = useRef<string>('');
  const liveIssueTsRef = useRef<number>(0);
  const currentPeriodRef = useRef<string>('');
  const isPredictingRef = useRef<boolean>(false);

  const triggerShake = useCallback(() => {
    setShakeBox(false);
    setTimeout(() => setShakeBox(true), 10);
    setTimeout(() => setShakeBox(false), 450);
  }, []);

  // Preload speechSynthesis voices silently
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          try {
            window.speechSynthesis.getVoices();
          } catch (_e) {}
        };
      } catch (_e) {}
    }
  }, []);

  // Parse raw JSON response from WinGo 1M history API
  const parseHistoryJson = (json: any): LiveHistoryItem[] => {
    let list: any[] = [];
    if (json) {
      if (json.data && Array.isArray(json.data.list)) list = json.data.list;
      else if (json.data && Array.isArray(json.data)) list = json.data;
      else if (Array.isArray(json.list)) list = json.list;
      else if (Array.isArray(json)) list = json;
    }
    if (!list.length) return [];

    return list.slice(0, 8).map((it) => {
      const num = parseInt(
        it.number != null ? it.number : it.result != null ? it.result : it.winNumber,
        10
      );
      return {
        issue: String(
          it.issueNumber != null ? it.issueNumber : it.issue != null ? it.issue : it.period || ''
        ),
        number: isNaN(num) ? 0 : num,
      };
    });
  };

  // Fetch REAL Game History (via backend proxy first to avoid CORS, then direct fallback)
  const fetchLiveHistory = useCallback(async () => {
    let mapped: LiveHistoryItem[] = [];

    // 1. Try server-side proxy (/api/wingo-history) which fetches directly from draw.ar-lottery01.com
    try {
      const resProxy = await fetch(`/api/wingo-history?ts=${Date.now()}`, { cache: 'no-store' });
      if (resProxy.ok) {
        const json = await resProxy.json();
        mapped = parseHistoryJson(json);
      }
    } catch (_e) {}

    // 2. Fallback to direct browser fetch if needed
    if (!mapped.length) {
      try {
        const resDirect = await fetch(`${API_ENDPOINT_1M_DIRECT}?ts=${Date.now()}&pageSize=10&pageNo=1&type=1`, {
          method: 'GET',
          cache: 'no-store',
        });
        if (resDirect.ok) {
          const json = await resDirect.json();
          mapped = parseHistoryJson(json);
        }
      } catch (_e) {}
    }

    if (mapped.length > 0) {
      setLiveHistory(mapped);
      if (mapped[0] && mapped[0].issue) {
        // Real game next period = latest completed issueNumber + 1
        const last4 = parseInt(mapped[0].issue.slice(-4), 10);
        const next4 = isNaN(last4)
          ? mapped[0].issue.slice(-4)
          : String((last4 + 1) % 10000).padStart(4, '0');
        liveIssueNoRef.current = next4;
        liveIssueTsRef.current = Date.now();
        setPeriodStr(next4);
      }
      setLiveOnline(true);
    } else if (Date.now() - liveIssueTsRef.current > 90000) {
      liveIssueNoRef.current = '';
      setLiveOnline(false);
    }
  }, []);

  // Restore encrypted session & start real history polling
  useEffect(() => {
    const saved = loadSession();
    if (saved && saved.mobile) {
      const master = saved.mobile === ADMIN_NUMBER || !!saved.master;
      setAccessGranted(true);
      setIsAdmin(master);
      setViewMode('ready');
      setWalletBalance(master ? 99999.0 : Math.max(500, saved.deposit || 2025.35));
    }
    fetchLiveHistory();
    const poll = setInterval(() => {
      if (document.visibilityState === 'visible') fetchLiveHistory();
    }, 5000);
    return () => clearInterval(poll);
  }, [fetchLiveHistory]);

  // 1-Minute Period & Countdown Ticker
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const rem = 60 - now.getSeconds();
      setSecondsLeft(rem);

      // Refresh real history right when a new minute starts
      if (rem === 60 || rem === 58 || rem === 55) {
        fetchLiveHistory();
      }

      let p: string;
      if (liveIssueNoRef.current && Date.now() - liveIssueTsRef.current < 120000) {
        p = String(liveIssueNoRef.current).slice(-4);
      } else {
        p = getOneMinutePeriod().slice(-4);
      }

      setPeriodStr(p);

      if (currentPeriodRef.current !== '' && currentPeriodRef.current !== p) {
        isPredictingRef.current = false;
        setViewMode((prev) => (prev === 'result' || prev === 'loader' ? 'ready' : prev));
      }
      currentPeriodRef.current = p;
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [fetchLiveHistory]);

  // Keep floating HUD and mini launcher within screen bounds on resize
  useEffect(() => {
    const handleResize = () => {
      setHudPos((prev) => ({
        x: Math.max(4, Math.min(window.innerWidth - 66, prev.x)),
        y: Math.max(4, Math.min(window.innerHeight - 66, prev.y)),
      }));
      setPanelPos((prev) => ({
        x: Math.max(-40, Math.min(window.innerWidth - 300, prev.x)),
        y: Math.max(-20, Math.min(window.innerHeight - 320, prev.y)),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ============================================================================
     ██  VERIFY HANDLER — 12-DIGIT ADMIN BYPASS + REFERRAL/DEPOSIT CHECK
     ============================================================================ */
  const verifyMobileNumber = useCallback(
    async (rawInput: string) => {
      const cleanDigits = String(rawInput).replace(/\D/g, '');

      if (!cleanDigits) {
        setLockError('Mobile number daalein!');
        playAudioWarning();
        triggerShake();
        return;
      }

      setIsVerifying(true);
      setLockError('');

      // 12-digit Admin Number (655675576694) — immediate bypass
      if (cleanDigits === ADMIN_NUMBER) {
        const adminUser = {
          mobile: ADMIN_NUMBER,
          name: 'ADMIN VIP',
          deposit: 99999,
          master: true,
        };
        saveSession(adminUser);
        setIsVerifying(false);
        setAccessGranted(true);
        setIsAdmin(true);
        setWalletBalance(99999.0);
        setLockError('');
        setViewMode('ready');
        return;
      }

      // Standard user 10-digit Indian mobile validation
      if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
        setIsVerifying(false);
        setLockError('Invalid number! 10-digit mobile number daalein.');
        playAudioWarning();
        triggerShake();
        return;
      }

      const userRecord = VERIFIED_REFERRAL_USERS[cleanDigits];
      const clickedRef = hasOpenedReferralLink();

      if (!userRecord || !userRecord.registered || (!clickedRef && !userRecord.viaLink)) {
        setIsVerifying(false);
        clearSession();
        setAccessGranted(false);
        setLockError(
          'Sabse pahle hack se registration karo, uske bad usi ID me minimum ₹500 ka deposit karo, uske bad hack open ho jayega.'
        );
        playAudioWarning();
        triggerShake();
        return;
      }

      if (Number(userRecord.deposit || 0) < 500) {
        setIsVerifying(false);
        clearSession();
        setAccessGranted(false);
        setLockError(
          `Deposit ₹${userRecord.deposit} mila! Minimum ₹500 deposit zaroori hai usi registered ID me.`
        );
        playAudioWarning();
        triggerShake();
        return;
      }

      const validUser = {
        mobile: cleanDigits,
        name: userRecord.name || 'VIP USER',
        deposit: Number(userRecord.deposit),
        master: false,
      };
      saveSession(validUser);
      setIsVerifying(false);
      setAccessGranted(true);
      setIsAdmin(false);
      setWalletBalance(Number(userRecord.deposit));
      setLockError('');
      setViewMode('ready');
    },
    [triggerShake]
  );

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    setMobileInput(digits);
    setLockError('');
    if (digits === ADMIN_NUMBER) {
      verifyMobileNumber(digits);
    }
  };

  /* ============================================================================
     ██  EXECUTE PREDICTION (1-MIN, 3 LEVEL FIX WIN, CORE LOGIC UNTOUCHED)
     ============================================================================ */
  const handleExecute = () => {
    if (!accessGranted) {
      setLockError(
        'Sabse pahle hack se registration karo, uske bad usi ID me minimum ₹500 ka deposit karo, uske bad hack open ho jayega.'
      );
      playAudioWarning();
      triggerShake();
      return;
    }

    if (isPredictingRef.current || viewMode === 'loader') return;
    isPredictingRef.current = true;
    setViewMode('loader');
    setLoaderProgress(0);
    setLoaderStageText('DECRYPTING HASH...');

    const stages = [
      'DECRYPTING HASH...',
      'BYPASSING SECURITY...',
      'ANALYZING PATTERN...',
      'EXTRACTING RESULT...',
    ];

    let p = 0;
    const activePeriod = periodStr || getOneMinutePeriod().slice(-4);

    const interval = setInterval(() => {
      p += 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setLoaderProgress(100);
        setLoaderHex(
          '0x' +
            Math.floor(Math.random() * 65535)
              .toString(16)
              .toUpperCase()
        );
        setLoaderStageText('COMPLETED');

        setTimeout(() => {
          // 🔒 Calls untouched getFixedResultForPeriod
          const fixed = getFixedResultForPeriod(activePeriod);
          setResultData({
            rn: fixed.rn,
            sz: fixed.sz,
            period: activePeriod,
          });
          setViewMode('result');
          isPredictingRef.current = false;
        }, 500);
      } else {
        setLoaderProgress(p);
        setLoaderHex(
          '0x' +
            Math.floor(Math.random() * 65535)
              .toString(16)
              .toUpperCase()
        );
        setLoaderStageText(stages[Math.floor((p / 101) * stages.length)]);
      }
    }, 80);
  };

  /* ============================================================================
     ██  SMOOTH DRAG ENGINE FOR MINI LOGO & FULL FLOATING HUD PANEL
     ============================================================================ */
  const miniDragRef = useRef({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const onMiniPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    miniDragRef.current.dragging = true;
    miniDragRef.current.moved = false;
    miniDragRef.current.startX = e.clientX;
    miniDragRef.current.startY = e.clientY;
    miniDragRef.current.origX = hudPos.x;
    miniDragRef.current.origY = hudPos.y;
    setIsDraggingMini(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_err) {}
  };

  const onMiniPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!miniDragRef.current.dragging) return;
    const dx = e.clientX - miniDragRef.current.startX;
    const dy = e.clientY - miniDragRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      miniDragRef.current.moved = true;
    }
    const maxX = window.innerWidth - 66;
    const maxY = window.innerHeight - 66;
    const nx = Math.max(4, Math.min(maxX, miniDragRef.current.origX + dx));
    const ny = Math.max(4, Math.min(maxY, miniDragRef.current.origY + dy));
    setHudPos({ x: nx, y: ny });
  };

  const onMiniPointerUp = () => {
    if (!miniDragRef.current.dragging) return;
    miniDragRef.current.dragging = false;
    setIsDraggingMini(false);
    try {
      localStorage.setItem(HUD_POS_KEY, JSON.stringify(hudPos));
    } catch (_e) {}
    if (!miniDragRef.current.moved) {
      setPanelOpen(true);
    }
  };

  // Full Floating HUD Panel Drag (works anywhere on the HUD except inputs, links, and buttons)
  const panelDragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const onPanelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, button, a')) {
      return; // Allow normal interaction on inputs, buttons, and links
    }
    panelDragRef.current.dragging = true;
    panelDragRef.current.startX = e.clientX;
    panelDragRef.current.startY = e.clientY;
    panelDragRef.current.origX = panelPos.x;
    panelDragRef.current.origY = panelPos.y;
    setIsDraggingPanel(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_err) {}
  };

  const onPanelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!panelDragRef.current.dragging) return;
    const dx = e.clientX - panelDragRef.current.startX;
    const dy = e.clientY - panelDragRef.current.startY;
    const maxX = window.innerWidth - 280;
    const maxY = window.innerHeight - 300;
    const nx = Math.max(-60, Math.min(maxX, panelDragRef.current.origX + dx));
    const ny = Math.max(-30, Math.min(maxY, panelDragRef.current.origY + dy));
    setPanelPos({ x: nx, y: ny });
  };

  const onPanelPointerUp = () => {
    if (!panelDragRef.current.dragging) return;
    panelDragRef.current.dragging = false;
    setIsDraggingPanel(false);
    try {
      localStorage.setItem(PANEL_POS_KEY, JSON.stringify(panelPos));
    } catch (_e) {}
  };

  return (
    <>
      {/* Background Game Iframe */}
      <div id="gameBg">
        <iframe
          id="gameFrame"
          src={REFERRAL_URL}
          referrerPolicy="no-referrer"
          allow="autoplay; fullscreen; clipboard-write"
          title="BDG WIN Game"
        />
      </div>

      {/* Floating Mini Logo Launcher */}
      {!panelOpen && (
        <div
          id="mini"
          className={`launcher ${isDraggingMini ? 'dragging' : ''}`}
          style={{ transform: `translate3d(${hudPos.x}px, ${hudPos.y}px, 0)` }}
          onPointerDown={onMiniPointerDown}
          onPointerMove={onMiniPointerMove}
          onPointerUp={onMiniPointerUp}
          onPointerCancel={onMiniPointerUp}
        >
          <div className="launcher-inner">
            <div className="mini-dot" />
            <img src="https://files.catbox.moe/ctp5nq.jpg" alt="AJAY VIP" draggable={false} />
          </div>
        </div>
      )}

      {/* Full Floating HUD Panel — smoothly draggable across the entire screen */}
      {panelOpen && (
        <div
          className={`wings-outer-container ${isDraggingPanel ? 'dragging' : ''}`}
          id="mainOuter"
          style={{ transform: `translate3d(${panelPos.x}px, ${panelPos.y}px, 0)` }}
          onPointerDown={onPanelPointerDown}
          onPointerMove={onPanelPointerMove}
          onPointerUp={onPanelPointerUp}
          onPointerCancel={onPanelPointerUp}
        >
          <div className="wings-inner-float">
            <div className="side-tab tab-t">
              <svg viewBox="0 0 160 45">
                <polygon points="80,2 2,43 158,43" className="anim-poly" />
              </svg>
            </div>
            <div className="side-tab tab-b">
              <svg viewBox="0 0 160 45">
                <polygon points="2,2 158,2 80,43" className="anim-poly" />
              </svg>
            </div>
            <div className="side-tab tab-l">
              <svg viewBox="0 0 35 220">
                <polygon points="33,2 2,110 33,218" className="anim-poly" />
              </svg>
            </div>
            <div className="side-tab tab-r">
              <svg viewBox="0 0 35 220">
                <polygon points="2,2 33,110 2,218" className="anim-poly" />
              </svg>
            </div>

            <div className="wings-left">
              <div className="wing-line">
                <div className="wing-center-dot" />
                <div className="wing-extra-dot-2" />
                <div className="wing-extra-dot-3" />
              </div>
              <div className="wing-line">
                <div className="wing-center-dot" />
                <div className="wing-extra-dot-2" />
                <div className="wing-extra-dot-3" />
              </div>
              <div className="wing-line">
                <div className="wing-center-dot" />
                <div className="wing-extra-dot-2" />
                <div className="wing-extra-dot-3" />
              </div>
            </div>

            <div className="wings-right">
              <div className="wing-line">
                <div className="wing-center-dot" />
                <div className="wing-extra-dot-2" />
                <div className="wing-extra-dot-3" />
              </div>
              <div className="wing-line">
                <div className="wing-center-dot" />
                <div className="wing-extra-dot-2" />
                <div className="wing-extra-dot-3" />
              </div>
              <div className="wing-line">
                <div className="wing-center-dot" />
                <div className="wing-extra-dot-2" />
                <div className="wing-extra-dot-3" />
              </div>
            </div>

            <div className={`running-border-box ${shakeBox ? 'shake' : ''}`}>
              <div id="main" className="injector-wrapper">
                <div className="glow-reader reader-tl" />
                <div className="glow-reader reader-btn-left" />
                <div className="glow-reader reader-hide-br" />

                {/* Header */}
                <div className="header-row">
                  <div className="title-group">
                    <span className="main-title">BDG WIN PANEL</span>
                  </div>
                  <div className="status-badge" id="badgeState">
                    <span>
                      {viewMode === 'loader'
                        ? 'ANALYZING'
                        : accessGranted
                        ? isAdmin
                          ? 'ADMIN'
                          : 'LIVE'
                        : 'LOCKED'}
                    </span>
                  </div>
                </div>

                {/* 1-Minute Period Display */}
                <div className="period-bar" id="topPeriodDisplay">
                  <span style={{ color: '#ffb3b3' }}>PERIOD: </span>
                  <span style={{ color: '#ffffff' }}>{periodStr}</span>
                  <span style={{ color: '#00ff88', marginLeft: 6 }}>{pad2(secondsLeft)}s</span>
                </div>

                {/* Real Game History Strip (WinGo 1M Live Numbers) */}
                <div className="live-strip">
                  <span className={`live-label ${liveOnline ? '' : 'off'}`} id="liveLabel">
                    <i />
                    {liveOnline ? '1M' : 'OFFLINE'}
                  </span>
                  <div className="live-dots" id="liveDots">
                    {liveHistory.slice(0, 5).map((item, idx) => (
                      <div
                        key={item.issue + '_' + idx}
                        className={`live-dot ${item.number >= 5 ? 'big' : 'small'}`}
                        title={`Period ${item.issue.slice(-4)}: ${item.number} (${
                          item.number >= 5 ? 'BIG' : 'SMALL'
                        })`}
                      >
                        {item.number}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display Screen */}
                <div className="display-screen">
                  <div className="bracket tl" />
                  <div className="bracket tr" />
                  <div className="bracket bl" />
                  <div className="bracket br" />

                  {/* VIEW: LOCKED */}
                  {!accessGranted && (
                    <div id="view-locked" className="state-view">
                      <div className="spider-wrap">
                        <div className="spider-inner">
                          <img
                            src="https://files.catbox.moe/6akj2j.jpg"
                            alt="Spider"
                            draggable={false}
                          />
                        </div>
                      </div>
                      <span className="text-white-glow">ACCESS LOCKED</span>
                      <span className="text-cyan-glow" style={{ fontSize: '8px', lineHeight: 1.3 }}>
                        Register + ₹500 deposit required
                      </span>

                      <div className="lock-row">
                        <input
                          id="lockMobileInput"
                          type="tel"
                          inputMode="numeric"
                          maxLength={12}
                          value={mobileInput}
                          onChange={handleMobileInputChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') verifyMobileNumber(mobileInput);
                          }}
                          placeholder="10-digit mobile"
                        />
                        <button
                          id="lockVerifyBtn"
                          type="button"
                          disabled={isVerifying}
                          onClick={() => verifyMobileNumber(mobileInput)}
                        >
                          {isVerifying ? '...' : 'VERIFY'}
                        </button>
                      </div>

                      <a
                        className="lock-reg-link"
                        id="lockRegLink"
                        href={REFERRAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markReferralLinkOpened()}
                      >
                        📝 REGISTER + DEPOSIT ₹500
                      </a>

                      <div className="lock-err" id="lockErr">
                        {lockError}
                      </div>
                    </div>
                  )}

                  {/* VIEW: READY */}
                  {accessGranted && viewMode === 'ready' && (
                    <div id="view-ready" className="state-view">
                      <div className="spider-wrap">
                        <div className="spider-inner">
                          <img
                            src="https://files.catbox.moe/6akj2j.jpg"
                            alt="Spider"
                            draggable={false}
                          />
                        </div>
                      </div>
                      <span className="text-white-glow">READY</span>
                      <span className="text-cyan-glow">AJAY VIP MOD</span>
                      <span id="ready-bal" className="text-sub-cyan">
                        BALANCE ₹{walletBalance.toFixed(2)}
                      </span>
                      <span className="fix-badge">✓ 3 LEVEL FIX WIN</span>
                    </div>
                  )}

                  {/* VIEW: LOADER */}
                  {accessGranted && viewMode === 'loader' && (
                    <div id="view-loader" className="state-view">
                      <div className="khatarnak-loader">
                        <div className="loader-pulse-glow" />
                        <div className="vortex-ring vr-1" />
                        <div className="vortex-ring vr-2" />
                        <div className="vortex-ring vr-3" />
                        <div className="loader-spider-core">
                          <img
                            src="https://files.catbox.moe/6akj2j.jpg"
                            alt="Core"
                            draggable={false}
                          />
                        </div>
                        <div className="hex-code" id="hexCode">
                          {loaderHex}
                          <br />
                          {loaderProgress}%
                        </div>
                      </div>
                      <span
                        id="loader-txt"
                        className="text-cyan-glow"
                        style={{ fontSize: '9px', marginTop: '16px' }}
                      >
                        {loaderStageText}
                      </span>
                      <div className="prog-bar-container">
                        <div
                          id="loader-bar"
                          className="prog-bar"
                          style={{ width: `${loaderProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* VIEW: RESULT */}
                  {accessGranted && viewMode === 'result' && (
                    <div id="view-result" className="state-view">
                      <div className="result-inner-box">
                        <div className="q-ring q1" />
                        <div className="q-ring q2" />
                        <div className="q-ring q3" />
                        <div className="q-ring q4" />
                        <div className="res-title">AI RESULT · 3 LEVEL FIX WIN</div>
                        <div className="result-layout">
                          <div className="res-value" id="finalResultText">
                            {resultData.sz}
                          </div>
                          <div className="res-ball" id="finalBallText">
                            <img
                              src={BALL_IMAGES[resultData.rn]}
                              alt={String(resultData.rn)}
                              draggable={false}
                              style={{
                                width: '38px',
                                height: '38px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                filter: 'drop-shadow(0 0 12px rgba(255,31,31,0.95))',
                                animation: 'numPop 0.4s cubic-bezier(.17,.89,.32,1.28)',
                              }}
                            />
                          </div>
                        </div>
                        <div className="res-sub" id="finalPeriodText">
                          PERIOD {resultData.period}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="action-container">
                  <button
                    type="button"
                    id="actionBtn"
                    className={`action-btn ${
                      !accessGranted || viewMode === 'loader' ? 'btn-wait' : 'btn-primary'
                    }`}
                    onClick={handleExecute}
                  >
                    {!accessGranted ? 'LOCKED' : viewMode === 'loader' ? 'WAIT' : 'EXECUTE'}
                  </button>

                  <button
                    type="button"
                    id="wingoBtn"
                    className="action-btn btn-wingame"
                    onClick={() => fetchLiveHistory()}
                  >
                    WINGO 1M
                  </button>

                  <button
                    type="button"
                    className="action-btn btn-secondary"
                    onClick={() => setPanelOpen(false)}
                  >
                    HIDE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
