// Quick test to verify DES correctness
// Load all modules
eval(require('fs').readFileSync('js/utils.js', 'utf8'));
eval(require('fs').readFileSync('js/permutations.js', 'utf8'));
eval(require('fs').readFileSync('js/sboxes.js', 'utf8'));
eval(require('fs').readFileSync('js/keySchedule.js', 'utf8'));
eval(require('fs').readFileSync('js/des.js', 'utf8'));

// Test vector from NIST
// Plaintext: 0123456789ABCDEF  Key: 133457799BBCDFF1
// Expected Ciphertext: 85E813540F0AB405

const pt = strToBitArray(hexToBin('0123456789ABCDEF'));
const key = strToBitArray(hexToBin('133457799BBCDFF1'));

console.log('=== DES Test ===');
console.log('Plaintext (hex):  0123456789ABCDEF');
console.log('Key (hex):        133457799BBCDFF1');

const encResult = runDES(pt, key, 'encrypt');
console.log('Ciphertext (hex): ' + encResult.resultHex);
console.log('Expected:         85E813540F0AB405');
console.log('Encrypt OK:       ' + (encResult.resultHex === '85E813540F0AB405'));

// Round-trip test
const decResult = runDES(encResult.result, key, 'decrypt');
console.log('Decrypted (hex):  ' + decResult.resultHex);
console.log('Round-trip OK:    ' + (decResult.resultHex === '0123456789ABCDEF'));

// Test 2: all zeros
const pt2 = strToBitArray(hexToBin('0000000000000000'));
const key2 = strToBitArray(hexToBin('0000000000000000'));
const enc2 = runDES(pt2, key2, 'encrypt');
console.log('\n=== Test 2 (All zeros) ===');
console.log('Ciphertext: ' + enc2.resultHex);
const dec2 = runDES(enc2.result, key2, 'decrypt');
console.log('Round-trip: ' + dec2.resultHex);
console.log('Round-trip OK: ' + (dec2.resultHex === '0000000000000000'));

// Subkey count check
console.log('\n=== Key Schedule Check ===');
console.log('Number of subkeys: ' + encResult.keySchedule.subkeys.length);
console.log('Number of rounds: ' + encResult.rounds.length);
console.log('S-boxes per round: ' + encResult.rounds[0].sboxDetails.length);
