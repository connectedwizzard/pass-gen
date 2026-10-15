(function (root) {
  'use strict';
  const GROUPS = Object.freeze({
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.?/'
  });
  const AMBIGUOUS = /[Il1O0o|]/g;

  // Reject the incomplete tail before taking the remainder: no modulo bias.
  function randomIndex(size, cryptoSource = root.crypto) {
    if (!Number.isInteger(size) || size < 1 || size > 0x100000000) {
      throw new RangeError('Invalid alphabet size.');
    }
    if (!cryptoSource || typeof cryptoSource.getRandomValues !== 'function') {
      throw new Error('Cryptographic randomness is unavailable in this browser.');
    }
    const ceiling = Math.floor(0x100000000 / size) * size;
    const value = new Uint32Array(1);
    do { cryptoSource.getRandomValues(value); } while (value[0] >= ceiling);
    return value[0] % size;
  }

  function generatePassword(options = {}, cryptoSource = root.crypto) {
    const { length = 20, lowercase = true, uppercase = true,
      numbers = true, symbols = true, excludeAmbiguous = false } = options;
    if (!Number.isInteger(length) || length < 4 || length > 128) {
      throw new RangeError('Choose a whole-number length between 4 and 128.');
    }
    const enabled = { lowercase, uppercase, numbers, symbols };
    const groups = Object.entries(GROUPS)
      .filter(([key]) => enabled[key])
      .map(([, chars]) => excludeAmbiguous ? chars.replace(AMBIGUOUS, '') : chars);
    if (!groups.length) throw new Error('Select at least one character type.');
    const alphabet = groups.join('');
    let password;
    // Reject entire candidates missing a selected group. Every accepted string
    // has equal probability, unlike forcibly inserting characters and shuffling.
    do {
      password = Array.from({ length }, () => alphabet[randomIndex(alphabet.length, cryptoSource)]).join('');
    } while (!groups.every(group => [...password].some(char => group.includes(char))));
    return password;
  }

  const api = Object.freeze({ generatePassword, randomIndex, GROUPS });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PasswordGenerator = api;
})(globalThis);
