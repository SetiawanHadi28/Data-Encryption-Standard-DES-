// ═══════════════════════════════════════════════════════════════════════════
//   DES KEY SCHEDULE
//   Generates 16 subkeys (K1–K16) from a 64-bit key
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate all 16 DES subkeys from a 64-bit key.
 * Returns a detailed trace object for visualization.
 *
 * @param {number[]} key64 - 64-bit key as bit array
 * @returns {object} Full key schedule trace
 */
function generateSubkeys(key64) {
  // Step 1: Apply PC-1 to get 56-bit key
  const pc1Result = permute(key64, PC1);

  // Step 2: Split into C0 (28 bits) and D0 (28 bits)
  const C0 = pc1Result.slice(0, 28);
  const D0 = pc1Result.slice(28, 56);

  const rounds = [];
  const subkeys = [];

  let C = [...C0];
  let D = [...D0];

  for (let round = 0; round < 16; round++) {
    // Step 3: Left shift C and D
    const shifts = SHIFT_SCHEDULE[round];
    C = leftShift(C, shifts);
    D = leftShift(D, shifts);

    // Step 4: Apply PC-2 to get 48-bit subkey
    const CD = [...C, ...D];
    const K = permute(CD, PC2);

    rounds.push({
      roundNum: round + 1,
      shifts: shifts,
      C: [...C],
      D: [...D],
      CD: [...CD],
      K: [...K]
    });

    subkeys.push([...K]);
  }

  return {
    key64: [...key64],
    pc1Result: [...pc1Result],
    C0: [...C0],
    D0: [...D0],
    rounds: rounds,
    subkeys: subkeys
  };
}
