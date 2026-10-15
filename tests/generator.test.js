'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generatePassword, randomIndex, GROUPS } = require('../generator.js');

test('every character selection, length boundary and lookalike option', () => {
  const keys = Object.keys(GROUPS);
  for (let mask = 1; mask < 16; mask++) {
    const selected = Object.fromEntries(keys.map((key, i) => [key, Boolean(mask & (1 << i))]));
    for (const length of [4, 20, 128]) {
      for (const excludeAmbiguous of [false, true]) {
        for (let repeat = 0; repeat < 10; repeat++) {
          const password = generatePassword({ ...selected, length, excludeAmbiguous });
          assert.equal(password.length, length);
          const alphabet = keys.filter(key => selected[key]).map(key => GROUPS[key]).join('');
          assert.ok([...password].every(char => alphabet.includes(char)));
          for (const key of keys.filter(key => selected[key])) {
            assert.ok([...password].some(char => GROUPS[key].includes(char)));
          }
          if (excludeAmbiguous) assert.doesNotMatch(password, /[Il1O0o|]/);
        }
      }
    }
  }
});

test('rejects invalid lengths and empty character selection', () => {
  for (const length of [0, 3, 129, 10.5, NaN, Infinity, '20', null]) {
    assert.throws(() => generatePassword({ length }), RangeError);
  }
  assert.throws(() => generatePassword({ lowercase: false, uppercase: false, numbers: false, symbols: false }), /at least one/);
});

test('random index rejects biased tail values', () => {
  let calls = 0;
  const values = [0xffffffff, 0xfffffffe, 7];
  const source = { getRandomValues(array) { array[0] = values[calls++]; return array; } };
  assert.equal(randomIndex(10, source), 7);
  assert.equal(calls, 3);
});

test('missing cryptographic randomness fails closed', () => {
  assert.throws(() => generatePassword({}, {}), /unavailable/);
  for (const size of [0, -1, 1.5, NaN, 0x100000001]) {
    assert.throws(() => randomIndex(size), RangeError);
  }
});

test('candidate missing a required group is rejected', () => {
  // First candidate is aaaa; second candidate is aaaA.
  const values = [0, 0, 0, 0, 0, 0, 0, 26];
  let calls = 0;
  const source = { getRandomValues(array) { array[0] = values[calls++]; return array; } };
  assert.equal(generatePassword({ length: 4, numbers: false, symbols: false }, source), 'aaaA');
  assert.equal(calls, 8);
});
