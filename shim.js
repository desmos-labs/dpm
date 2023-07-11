// Polyfill URL
import 'react-native-url-polyfill/auto';
// Polyfill Intl.PluralRules to support the new i18n v4 api
import 'intl-pluralrules';
// Wallet Shims
import '@walletconnect/react-native-compat';

if (typeof __dirname === 'undefined') global.__dirname = '/';
if (typeof __filename === 'undefined') global.__filename = '';
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

process.browser = false;
if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer;

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__;
Object.assign(process.env, { NODE_ENV: isDev ? 'development' : 'production' });
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto');

if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');

// Wallet connect TextEncoding polyfill
const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

// Polyfill DataView.setBigUint64 to correctly compute the sha2 on Android.
if (global.DataView.prototype.setBigUint64 === undefined) {
  global.DataView.prototype.setBigUint64 = function (byteOffset, value, isLE) {
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number(value.shiftRight(_32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    this.setUint32(byteOffset + h, wh, isLE);
    this.setUint32(byteOffset + l, wl, isLE);
  };
}
