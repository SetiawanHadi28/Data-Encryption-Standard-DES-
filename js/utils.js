// ═══════════════════════════════════════════════════════════════════════════
//   DES UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert a hexadecimal string (16 chars) to a 64-char binary string.
 * @param {string} hex - 16-character hex string
 * @returns {string} 64-character binary string
 */
function hexToBin(hex) {
  return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
}

/**
 * Convert a 64-char binary string to a hexadecimal string (16 chars).
 * @param {string} bin - 64-character binary string
 * @returns {string} 16-character hex string (uppercase)
 */
function binToHex(bin) {
  let hex = '';
  for (let i = 0; i < bin.length; i += 4) {
    hex += parseInt(bin.substr(i, 4), 2).toString(16).toUpperCase();
  }
  return hex;
}

/**
 * Convert a binary string to a number array.
 * @param {string} str - e.g. "10110100"
 * @returns {number[]}
 */
function strToBitArray(str) {
  return str.split('').map(Number);
}

/**
 * Convert a bit array to binary string.
 * @param {number[]} arr
 * @returns {string}
 */
function bitArrayToStr(arr) {
  return arr.join('');
}

/**
 * Apply a permutation table to a bit array.
 * Table values are 1-indexed positions.
 * @param {number[]} bits - source bit array
 * @param {number[]} table - permutation table (1-indexed)
 * @returns {number[]} permuted bit array
 */
function permute(bits, table) {
  return table.map(pos => bits[pos - 1]);
}

/**
 * XOR two bit arrays of the same length.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number[]}
 */
function xorBits(a, b) {
  return a.map((bit, i) => bit ^ b[i]);
}

/**
 * Perform a circular left shift on an array.
 * @param {number[]} arr
 * @param {number} n - number of positions to shift
 * @returns {number[]}
 */
function leftShift(arr, n) {
  return [...arr.slice(n), ...arr.slice(0, n)];
}

/**
 * Convert a 4-bit number (0-15) to a 4-bit binary array.
 * @param {number} val
 * @returns {number[]}
 */
function numTo4Bits(val) {
  return [(val >> 3) & 1, (val >> 2) & 1, (val >> 1) & 1, val & 1];
}

/**
 * Validate a binary string (only 0s and 1s, exact length).
 * @param {string} str
 * @param {number} len
 * @returns {boolean}
 */
function isValidBinary(str, len) {
  return new RegExp(`^[01]{${len}}$`).test(str);
}

/**
 * Validate a hex string (hex chars, exact length).
 * @param {string} str
 * @param {number} len
 * @returns {boolean}
 */
function isValidHex(str, len) {
  return new RegExp(`^[0-9A-Fa-f]{${len}}$`).test(str);
}

/**
 * Format bits into groups of n for readability.
 * @param {string} bitStr
 * @param {number} groupSize
 * @returns {string}
 */
function formatBits(bitStr, groupSize = 4) {
  return bitStr.match(new RegExp(`.{1,${groupSize}}`, 'g')).join(' ');
}

/**
 * Copy text to clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }
}
