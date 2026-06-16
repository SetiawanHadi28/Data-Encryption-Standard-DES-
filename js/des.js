// ═══════════════════════════════════════════════════════════════════════════
//   DES CORE ALGORITHM
//   Implements the full DES Feistel cipher with detailed trace output
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DES Feistel F-function for a single round.
 * R (32-bit) → Expand → XOR with K → S-Box substitute → P permute
 *
 * @param {number[]} R - 32-bit right half
 * @param {number[]} K - 48-bit subkey
 * @returns {object} Detailed trace of F-function computation
 */
function fFunction(R, K) {
  // 1. Expansion: 32-bit → 48-bit
  const expanded = permute(R, E);

  // 2. XOR with subkey
  const xorResult = xorBits(expanded, K);

  // 3. S-Box substitution: 48-bit → 32-bit (8 groups of 6 → 4 bits each)
  const sboxDetails = [];
  const sboxOutputBits = [];

  for (let s = 0; s < 8; s++) {
    const group = xorResult.slice(s * 6, s * 6 + 6);

    // Row: bits 1 and 6 (outer bits), 0-indexed: [0] and [5]
    const row = (group[0] << 1) | group[5];
    // Column: bits 2-5 (inner 4 bits), 0-indexed: [1][2][3][4]
    const col = (group[1] << 3) | (group[2] << 2) | (group[3] << 1) | group[4];

    const sboxVal = SBOXES[s][row][col];
    const outBits = numTo4Bits(sboxVal);
    sboxOutputBits.push(...outBits);

    sboxDetails.push({
      sboxNum: s + 1,
      inputBits: [...group],
      inputStr: group.join(''),
      row: row,
      col: col,
      rowBin: row.toString(2).padStart(2, '0'),
      colBin: col.toString(2).padStart(4, '0'),
      outputVal: sboxVal,
      outputBits: outBits,
      outputStr: outBits.join('')
    });
  }

  // 4. P permutation: 32-bit → 32-bit
  const pResult = permute(sboxOutputBits, P);

  return {
    expanded: expanded,
    xorResult: xorResult,
    sboxDetails: sboxDetails,
    sboxCombined: [...sboxOutputBits],
    pResult: pResult
  };
}

/**
 * Run the full DES algorithm with detailed visualization trace.
 *
 * @param {number[]} block64 - 64-bit plaintext/ciphertext as bit array
 * @param {number[]} key64 - 64-bit key as bit array
 * @param {string} mode - 'encrypt' or 'decrypt'
 * @returns {object} Full DES trace for visualization
 */
function runDES(block64, key64, mode) {
  // ─── Key Schedule ───
  const keySchedule = generateSubkeys(key64);

  // For decryption, reverse the subkey order
  const subkeys = mode === 'decrypt'
    ? [...keySchedule.subkeys].reverse()
    : [...keySchedule.subkeys];

  // ─── Initial Permutation ───
  const ipResult = permute(block64, IP);
  let L = ipResult.slice(0, 32);
  let R = ipResult.slice(32, 64);

  // ─── 16 Feistel Rounds ───
  const rounds = [];

  for (let i = 0; i < 16; i++) {
    const K = subkeys[i];
    const L_prev = [...L];
    const R_prev = [...R];

    const fTrace = fFunction(R_prev, K);

    // New L = old R, New R = old L XOR F(R, K)
    const newR = xorBits(L_prev, fTrace.pResult);
    const newL = [...R_prev];

    rounds.push({
      roundNum: i + 1,
      subkeyIndex: mode === 'decrypt' ? (16 - i) : (i + 1),
      L_prev: [...L_prev],
      R_prev: [...R_prev],
      K: [...K],
      expanded: fTrace.expanded,
      xorResult: fTrace.xorResult,
      sboxDetails: fTrace.sboxDetails,
      sboxCombined: fTrace.sboxCombined,
      pResult: fTrace.pResult,
      L_new: [...newL],
      R_new: [...newR]
    });

    L = newL;
    R = newR;
  }

  // ─── Final swap: After round 16, swap L and R ───
  // Standard DES: preoutput = R16 || L16
  const preOutput = [...R, ...L];

  // ─── Inverse Initial Permutation ───
  const result = permute(preOutput, IP_INV);

  return {
    mode: mode,
    input: [...block64],
    key: [...key64],
    keySchedule: keySchedule,
    subkeys: subkeys,
    ipResult: [...ipResult],
    L0: ipResult.slice(0, 32),
    R0: ipResult.slice(32, 64),
    rounds: rounds,
    preOutput: [...preOutput],
    result: [...result],
    resultBin: result.join(''),
    resultHex: binToHex(result.join(''))
  };
}
