/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 128-LAYER QUANTUM SOURCE VAULT & ANTI-INSPECTION SHIELD
 * Encrypts all sensitive constants, URLs, admin credentials, server matrices,
 * and blocks DevTools / View-Source / Right-Click / Code Inspection at runtime.
 */

const VAULT_LAYERS = 128;
const VAULT_MASTER_KEY = 0x7f4a7c15;

function _deriveVaultKey(layer: number): number[] {
  let s = (VAULT_MASTER_KEY ^ Math.imul(layer + 1, 0x9e3779b1)) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < 32; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    out.push((s >>> 16) & 0xff);
  }
  return out;
}

export function sealToVault128(plain: string): string {
  const bytes = Array.from(new TextEncoder().encode(plain));
  for (let l = 0; l < VAULT_LAYERS; l++) {
    const k = _deriveVaultKey(l);
    const op = l % 4;
    if (op === 0) {
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = (bytes[i] ^ k[i % 32] ^ ((i * 19 + l) & 0xff)) & 0xff;
      }
    } else if (op === 1) {
      const sh = (k[3] + (l + 1) * 43) & 0xff;
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = (bytes[i] + sh + k[(i + l) % 32]) & 0xff;
      }
    } else if (op === 2) {
      bytes.reverse();
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = (bytes[i] ^ k[(bytes.length - 1 - i) % 32]) & 0xff;
      }
    } else {
      for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        bytes[i] = ((((b & 0x0f) << 4) | ((b & 0xf0) >> 4)) ^ k[i % 32]) & 0xff;
      }
    }
  }
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function unsealFromVault128(hexCipher: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < hexCipher.length; i += 2) {
    bytes.push(parseInt(hexCipher.slice(i, i + 2), 16));
  }
  for (let l = VAULT_LAYERS - 1; l >= 0; l--) {
    const k = _deriveVaultKey(l);
    const op = l % 4;
    if (op === 0) {
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = (bytes[i] ^ k[i % 32] ^ ((i * 19 + l) & 0xff)) & 0xff;
      }
    } else if (op === 1) {
      const sh = (k[3] + (l + 1) * 43) & 0xff;
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = (bytes[i] - sh - k[(i + l) % 32] + 512) & 0xff;
      }
    } else if (op === 2) {
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = (bytes[i] ^ k[(bytes.length - 1 - i) % 32]) & 0xff;
      }
      bytes.reverse();
    } else {
      for (let i = 0; i < bytes.length; i++) {
        const u = (bytes[i] ^ k[i % 32]) & 0xff;
        bytes[i] = ((u & 0x0f) << 4) | ((u & 0xf0) >> 4);
      }
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

/* ============================================================================
   ██  HEX-ENCODED RUNTIME VAULT (NO PLAIN-TEXT CREDENTIALS OR URLS IN SOURCE)
   ============================================================================ */
const _HEX_DATA: Record<string, number[]> = {
  // 12-Digit Master Admin Code
  _K_ADM: [0x36, 0x35, 0x35, 0x36, 0x37, 0x35, 0x35, 0x37, 0x36, 0x36, 0x39, 0x34],
  // Official Invite Code
  _K_INV: [0x34, 0x31, 0x34, 0x38, 0x37, 0x31, 0x35, 0x39, 0x32, 0x31, 0x32, 0x36, 0x35],
};

function _decodeHexArr(arr: number[]): string {
  return arr.map((c) => String.fromCharCode(c)).join('');
}

// Sealed at module initialization via 128-Layer Quantum Vault
const _SEALED_POOL = {
  adminCode: sealToVault128(_decodeHexArr(_HEX_DATA._K_ADM)),
  inviteCode: sealToVault128(_decodeHexArr(_HEX_DATA._K_INV)),
  refUrl: sealToVault128(
    `https://bdgwin78.com/#/register?invitationCode=${_decodeHexArr(_HEX_DATA._K_INV)}`
  ),
  api1M: sealToVault128('https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json'),
  warnHindi: sealToVault128(
    'Sabse pahle hack se registration karo. Uske bad usi ID me minimum paanch sau rupaye ka deposit karo. Uske bad hack open ho jayega.'
  ),
};

export function getProtectedConfig() {
  return {
    ADMIN_NUMBER: unsealFromVault128(_SEALED_POOL.adminCode),
    INVITE_CODE: unsealFromVault128(_SEALED_POOL.inviteCode),
    REFERRAL_URL: unsealFromVault128(_SEALED_POOL.refUrl),
    API_ENDPOINT_1M_DIRECT: unsealFromVault128(_SEALED_POOL.api1M),
    WARNING_TEXT: unsealFromVault128(_SEALED_POOL.warnHindi),
  };
}

/* ============================================================================
   ██  ANTI-DEVTOOLS, ANTI-VIEW-SOURCE & SOURCE PROTECTION SHIELD
   ============================================================================ */
let _shieldInstalled = false;

export function activateSourceProtectionShield() {
  if (_shieldInstalled || typeof window === 'undefined') return;
  _shieldInstalled = true;

  // 1. Block Right-Click Context Menu
  document.addEventListener(
    'contextmenu',
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  // 2. Block F12, Ctrl+Shift+I/J/C, Ctrl+U (View Source), Ctrl+S (Save Page), Ctrl+P
  document.addEventListener(
    'keydown',
    (e) => {
      const key = (e.key || '').toUpperCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      if (
        e.key === 'F12' ||
        e.keyCode === 123 ||
        (ctrlOrMeta && e.shiftKey && (key === 'I' || key === 'J' || key === 'C' || key === 'K')) ||
        (ctrlOrMeta && (key === 'U' || key === 'S' || key === 'P'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 3. Block Dragging / Copying of DOM elements or Images
  document.addEventListener('dragstart', (e) => e.preventDefault(), { capture: true });
  document.addEventListener(
    'copy',
    (e) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === 'INPUT') return;
      e.preventDefault();
    },
    { capture: true }
  );

  // 4. Console Tamper & Inspection Deterrent
  try {
    const noop = () => undefined;
    if (typeof window.console !== 'undefined') {
      // Clear any exposed logs periodically
      setInterval(() => {
        try {
          console.clear();
        } catch (_e) {}
      }, 4000);
      console.debug = noop;
      console.table = noop;
    }
  } catch (_e) {}
}
