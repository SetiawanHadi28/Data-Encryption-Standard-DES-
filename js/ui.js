// ═══════════════════════════════════════════════════════════════════════════
//   DES UI RENDERER
//   Builds the step-by-step visualization HTML from a DES trace object.
//   Mirrors the visual style of the S-DES Tugas12 project.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Render a row of bit cells. Matches S-DES bitCells() style.
 */
function bitCells(arr, cls, startIdx) {
  if (startIdx === undefined) startIdx = 1;
  return arr.map((b, i) =>
    `<div class="bit-cell ${b === 1 ? 'b1' : 'b0'} ${cls || ''}"><span class="bit-idx">${startIdx + i}</span><span class="bit-val">${b}</span></div>`
  ).join('');
}

/**
 * Render a labeled row of bits.
 */
function bitRow(label, arr, cls, startIdx) {
  return `<div class="step-row"><span class="step-row-label">${label}</span><div class="bit-row">${bitCells(arr, cls, startIdx)}</div></div>`;
}

/**
 * Render an XOR operation visualization.
 */
function xorRowHTML(label, a, b, res, cls1, cls2, clsR) {
  return `<div class="step-row">
    <span class="step-row-label">${label}</span>
    <div class="xor-row">
      <div class="bit-row">${bitCells(a, cls1 || '')}</div>
      <span class="xor-op">⊕</span>
      <div class="bit-row">${bitCells(b, cls2 || 'warn')}</div>
      <span class="xor-op">=</span>
      <div class="bit-row">${bitCells(res, clsR || 'accent3')}</div>
    </div>
  </div>`;
}

/**
 * Build the S-Box detail HTML for one S-Box lookup.
 * Shows table with highlighted row/col, plus metadata.
 */
function sboxDetailHTML(sd) {
  const box = SBOXES[sd.sboxNum - 1];
  const colHeaders = [];
  for (let c = 0; c < 16; c++) colHeaders.push(c);

  let headerRow = '<th>Row\\Col</th>';
  for (let c = 0; c < 16; c++) {
    headerRow += `<th>${c}</th>`;
  }

  let bodyRows = '';
  for (let r = 0; r < 4; r++) {
    const isRowHL = (r === sd.row);
    let cells = `<td style="font-weight:700;color:var(--accent);">${r}</td>`;
    for (let c = 0; c < 16; c++) {
      const isCell = (r === sd.row && c === sd.col);
      cells += `<td class="${isCell ? 'highlight-cell' : ''}">${box[r][c]}</td>`;
    }
    bodyRows += `<tr class="${isRowHL ? 'highlight' : ''}">${cells}</tr>`;
  }

  return `<div class="sbox-detail">
    <div class="sbox-detail-header">S-Box ${sd.sboxNum}</div>
    <div class="sbox-detail-info">
      Input: <span class="val">${sd.inputStr}</span> &nbsp;→&nbsp;
      Baris [b1,b6]: <span class="val">${sd.rowBin}</span> = ${sd.row} &nbsp;·&nbsp;
      Kolom [b2-b5]: <span class="val">${sd.colBin}</span> = ${sd.col} &nbsp;→&nbsp;
      Output: <span class="val">${sd.outputVal}</span> = <span class="val">${sd.outputStr}</span>
    </div>
    <div class="table-scroll">
      <table class="sbox-table">
        <tr>${headerRow}</tr>
        ${bodyRows}
      </table>
    </div>
  </div>`;
}

/**
 * Render the Key Schedule section.
 */
function renderKeyScheduleHTML(trace) {
  const ks = trace.keySchedule;
  let html = '';

  // PC-1
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">1</span> Permuted Choice 1 (PC-1) — 64-bit → 56-bit</div>`;
  html += bitRow('Original Key (64-bit):', ks.key64, '', 1);
  html += `<div class="step-row"><span class="step-row-label">Tabel PC-1:</span><div class="perm-table">${PC1.map(v => `<div class="perm-cell">${v}</div>`).join('')}</div></div>`;
  html += bitRow('Hasil PC-1 (56-bit):', ks.pc1Result, 'accent2', 1);
  html += `</div>`;

  // Split C0/D0
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">2</span> Pembagian C0 dan D0 (masing-masing 28-bit)</div>`;
  html += bitRow('C0 (28-bit):', ks.C0, 'b1', 1);
  html += bitRow('D0 (28-bit):', ks.D0, 'accent3', 1);
  html += `</div>`;

  // Left Shifts & Subkeys
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">3</span> Left Shift & PC-2 — 16 Subkeys</div>`;
  html += `<div class="key-grid">`;
  ks.rounds.forEach(r => {
    html += `<div class="key-card">
      <div class="key-card-title">
        Round ${r.roundNum}
        <span class="shift-info">LS-${r.shifts}</span>
      </div>
      <div class="key-card-row"><span class="lbl">C${r.roundNum}</span><span class="bits">${r.C.join('')}</span></div>
      <div class="key-card-row"><span class="lbl">D${r.roundNum}</span><span class="bits">${r.D.join('')}</span></div>
      <div class="key-card-row subkey"><span class="lbl">K${r.roundNum}</span><span class="bits">${r.K.join('')}</span></div>
    </div>`;
  });
  html += `</div></div>`;

  return html;
}

/**
 * Render a single Feistel round detail.
 */
function renderRoundHTML(r, i, trace) {
  const subkeyLabel = `K${r.subkeyIndex}`;
  let html = '';

  html += bitRow(`L${i} (32-bit):`, r.L_prev, 'b1', 1);
  html += bitRow(`R${i} (32-bit):`, r.R_prev, 'accent3', 1);

  html += `<div class="section-divider">▸ F-Function — R${i} dengan ${subkeyLabel}</div>`;

  // Expansion
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">E</span> Expansion Permutation E(R${i})</div>`;
  html += bitRow(`R${i} (32-bit):`, r.R_prev, 'accent3', 1);
  html += bitRow(`E(R${i}) (48-bit):`, r.expanded, 'accent2', 1);
  html += `</div>`;

  // XOR with subkey
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">⊕</span> XOR E(R${i}) dengan ${subkeyLabel}</div>`;
  html += xorRowHTML(`E(R${i}) ⊕ ${subkeyLabel}:`, r.expanded, r.K, r.xorResult, 'accent2', 'warn', 'b1');
  html += `</div>`;

  // S-Box Substitution
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">S</span> S-Box Substitution (48-bit → 32-bit)</div>`;
  html += bitRow('S-Box Input (48-bit):', r.xorResult, 'b1', 1);
  html += `<div class="sbox-grid">`;
  r.sboxDetails.forEach(sd => {
    html += sboxDetailHTML(sd);
  });
  html += `</div>`;
  html += bitRow('S-Box Output (32-bit):', r.sboxCombined, 'accent3', 1);
  html += `</div>`;

  // P Permutation
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">P</span> Permutation P</div>`;
  html += bitRow('P(S-Box Output):', r.pResult, 'accent2', 1);
  html += `</div>`;

  // XOR L with F result
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">⊕</span> L${i} ⊕ F(R${i}, ${subkeyLabel})</div>`;
  html += xorRowHTML(`L${i} ⊕ P(result):`, r.L_prev, r.pResult, r.R_new, 'b1', 'accent2', 'warn');
  html += `</div>`;

  // New L and R
  html += bitRow(`New L${r.roundNum} (= R${i}):`, r.L_new, 'accent3', 1);
  html += bitRow(`New R${r.roundNum} (= XOR result):`, r.R_new, 'warn', 1);

  return html;
}

/**
 * Build the full steps HTML from a DES trace.
 */
function buildStepsHTML(trace) {
  const modeLabel = trace.mode === 'encrypt' ? 'ENKRIPSI' : 'DEKRIPSI';
  let html = '';

  // ── KEY SCHEDULE ──
  html += `<div class="phase-header">Fase 1 — Pembangkitan 16 Subkey (Key Schedule)</div>`;
  html += renderKeyScheduleHTML(trace);

  if (trace.mode === 'decrypt') {
    html += `<div class="decrypt-note">⚠️ Mode Dekripsi: Urutan subkey dibalik — Round 1 menggunakan K16, Round 16 menggunakan K1.</div>`;
  }

  // ── INITIAL PERMUTATION ──
  html += `<div class="phase-header">Fase 2 — Initial Permutation (IP)</div>`;
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">4</span> Initial Permutation (IP)</div>`;
  html += bitRow('Input Block (64-bit):', trace.input, '', 1);
  html += `<div class="step-row"><span class="step-row-label">Tabel IP:</span><div class="perm-table">${IP.map(v => `<div class="perm-cell">${v}</div>`).join('')}</div></div>`;
  html += bitRow('Hasil IP (64-bit):', trace.ipResult, 'accent2', 1);
  html += bitRow('L0 (32-bit):', trace.L0, 'b1', 1);
  html += bitRow('R0 (32-bit):', trace.R0, 'accent3', 1);
  html += `</div>`;

  // ── 16 FEISTEL ROUNDS ──
  html += `<div class="phase-header">Fase 3 — 16 Putaran Feistel</div>`;

  trace.rounds.forEach((r, i) => {
    const subkeyLabel = `K${r.subkeyIndex}`;
    const roundId = `round-${r.roundNum}`;

    html += `<div class="round-toggle" id="toggle-${roundId}" onclick="toggleRound('${roundId}')">
      <span class="round-label">Round ${r.roundNum}<span class="key-info">— menggunakan ${subkeyLabel}</span></span>
      <span class="round-arrow">▼</span>
    </div>`;
    html += `<div class="round-content" id="content-${roundId}">`;
    html += renderRoundHTML(r, i, trace);
    html += `</div>`;
  });

  // ── FINAL PERMUTATION ──
  html += `<div class="phase-header">Fase 4 — Final Permutation (IP⁻¹)</div>`;
  html += `<div class="step-block">`;
  html += `<div class="step-title"><span class="step-num">5</span> 32-bit Swap & Inverse IP</div>`;
  html += `<p style="font-size:12px;color:var(--text-dim);margin-bottom:12px;">Setelah Round 16, L dan R ditukar: hasil = R16 || L16, lalu diterapkan IP⁻¹.</p>`;
  html += bitRow('Pre-Output (R16||L16):', trace.preOutput, 'accent2', 1);
  html += `<div class="step-row"><span class="step-row-label">Tabel IP⁻¹:</span><div class="perm-table">${IP_INV.map(v => `<div class="perm-cell">${v}</div>`).join('')}</div></div>`;
  html += bitRow(`Hasil ${modeLabel} (64-bit):`, trace.result, 'accent3', 1);
  html += `</div>`;

  return html;
}

/**
 * Toggle a collapsible round section.
 */
function toggleRound(roundId) {
  const toggle = document.getElementById('toggle-' + roundId);
  const content = document.getElementById('content-' + roundId);
  toggle.classList.toggle('open');
  content.classList.toggle('open');
}

/**
 * Build static reference table card HTML.
 */
function buildRefCard(title, tableData) {
  const cells = tableData.map(v => `<span>${v}</span>`).join('');
  return `<div class="ref-card"><h4>${title}</h4><div class="ref-perm">${cells}</div></div>`;
}

/**
 * Build a reference S-Box table HTML.
 */
function buildRefSbox(title, sbox) {
  let headerCols = '<th></th>';
  for (let c = 0; c < 16; c++) headerCols += `<th>${c}</th>`;

  let rows = '';
  for (let r = 0; r < 4; r++) {
    let cells = `<td style="font-weight:700;color:var(--accent);">${r}</td>`;
    for (let c = 0; c < 16; c++) {
      cells += `<td>${sbox[r][c]}</td>`;
    }
    rows += `<tr>${cells}</tr>`;
  }

  return `<div class="ref-card">
    <h4>${title}</h4>
    <div class="table-scroll">
      <table class="sbox-table"><tr>${headerCols}</tr>${rows}</table>
    </div>
  </div>`;
}

/**
 * Initialize reference tables in the page.
 */
function initRefTables() {
  const container = document.getElementById('ref-tables-container');
  if (!container) return;

  let html = '';
  html += buildRefCard('IP (Initial Permutation)', IP);
  html += buildRefCard('IP⁻¹ (Final Permutation)', IP_INV);
  html += buildRefCard('PC-1 (Permuted Choice 1)', PC1);
  html += buildRefCard('PC-2 (Permuted Choice 2)', PC2);
  html += buildRefCard('E (Expansion)', E);
  html += buildRefCard('P (Permutation)', P);

  for (let i = 0; i < 8; i++) {
    html += buildRefSbox(`S${i + 1}`, SBOXES[i]);
  }

  container.innerHTML = html;
}

/**
 * Export full DES log as text file.
 */
function exportLog(trace) {
  const modeLabel = trace.mode.toUpperCase();
  let log = '';
  log += `════════════════════════════════════════════════════════\n`;
  log += `  DATA ENCRYPTION STANDARD (DES) — ${modeLabel} LOG\n`;
  log += `════════════════════════════════════════════════════════\n\n`;
  log += `Input  (Bin): ${trace.input.join('')}\n`;
  log += `Input  (Hex): ${binToHex(trace.input.join(''))}\n`;
  log += `Key    (Bin): ${trace.key.join('')}\n`;
  log += `Key    (Hex): ${binToHex(trace.key.join(''))}\n`;
  log += `Output (Bin): ${trace.resultBin}\n`;
  log += `Output (Hex): ${trace.resultHex}\n\n`;

  log += `──── KEY SCHEDULE ────\n`;
  log += `PC-1 Result: ${trace.keySchedule.pc1Result.join('')}\n`;
  log += `C0: ${trace.keySchedule.C0.join('')}\n`;
  log += `D0: ${trace.keySchedule.D0.join('')}\n\n`;

  trace.keySchedule.rounds.forEach(r => {
    log += `Round ${r.roundNum.toString().padStart(2, ' ')} (LS-${r.shifts}): C${r.roundNum}=${r.C.join('')}  D${r.roundNum}=${r.D.join('')}  K${r.roundNum}=${r.K.join('')}\n`;
  });

  log += `\n──── INITIAL PERMUTATION ────\n`;
  log += `IP Result: ${trace.ipResult.join('')}\n`;
  log += `L0: ${trace.L0.join('')}\n`;
  log += `R0: ${trace.R0.join('')}\n\n`;

  log += `──── 16 FEISTEL ROUNDS ────\n`;
  trace.rounds.forEach(r => {
    log += `\n▸ Round ${r.roundNum.toString().padStart(2, ' ')} (K${r.subkeyIndex}):\n`;
    log += `  L${(r.roundNum - 1).toString().padStart(2, ' ')}       = ${r.L_prev.join('')}\n`;
    log += `  R${(r.roundNum - 1).toString().padStart(2, ' ')}       = ${r.R_prev.join('')}\n`;
    log += `  E(R)      = ${r.expanded.join('')}\n`;
    log += `  K${r.subkeyIndex.toString().padStart(2, ' ')}       = ${r.K.join('')}\n`;
    log += `  E(R)⊕K    = ${r.xorResult.join('')}\n`;

    r.sboxDetails.forEach(sd => {
      log += `  S${sd.sboxNum}: in=${sd.inputStr} row=${sd.row} col=${sd.col} out=${sd.outputVal}(${sd.outputStr})\n`;
    });

    log += `  S-out     = ${r.sboxCombined.join('')}\n`;
    log += `  P(S-out)  = ${r.pResult.join('')}\n`;
    log += `  New L${r.roundNum.toString().padStart(2, ' ')}   = ${r.L_new.join('')}\n`;
    log += `  New R${r.roundNum.toString().padStart(2, ' ')}   = ${r.R_new.join('')}\n`;
  });

  log += `\n──── FINAL PERMUTATION ────\n`;
  log += `Pre-Output (R16||L16): ${trace.preOutput.join('')}\n`;
  log += `IP⁻¹ Result: ${trace.resultBin}\n`;
  log += `Result (Hex): ${trace.resultHex}\n`;

  const blob = new Blob([log], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `des_${trace.mode}_log.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initialize reference tables when DOM loads
document.addEventListener('DOMContentLoaded', initRefTables);
