'use strict';
const $ = id => document.getElementById(id);
const output = $('password');
const status = $('status');
const groupIds = ['uppercase', 'lowercase', 'numbers', 'symbols'];
let copyRevision = 0;

function generate() {
  copyRevision++;
  status.textContent = '';
  $('copy').textContent = 'Copy';
  const length = Number($('length-number').value);
  try {
    output.value = PasswordGenerator.generatePassword({
      length,
      ...Object.fromEntries(groupIds.map(id => [id, $(id).checked])),
      excludeAmbiguous: $('exclude-ambiguous').checked
    });
    $('length-badge').textContent = `${length} characters`;
    $('copy').disabled = false;
  } catch (error) {
    output.value = '';
    $('length-badge').textContent = 'Check settings';
    $('copy').disabled = true;
    status.textContent = error.message;
  }
}

$('generate').addEventListener('click', generate);
$('length').addEventListener('input', () => {
  $('length-number').value = $('length').value;
  generate();
});
$('length-number').addEventListener('input', () => {
  if ($('length-number').validity.valid && $('length-number').value !== '') {
    $('length').value = $('length-number').value;
  }
  generate();
});
[...groupIds, 'exclude-ambiguous'].forEach(id => $(id).addEventListener('change', generate));
$('reveal').addEventListener('click', () => {
  const show = output.type === 'password';
  output.type = show ? 'text' : 'password';
  $('reveal').textContent = show ? 'Hide' : 'Show';
  $('reveal').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  $('reveal').setAttribute('aria-pressed', String(show));
});
$('copy').addEventListener('click', async () => {
  if (!output.value) return;
  const revision = copyRevision;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(output.value);
    if (revision !== copyRevision) return;
    $('copy').textContent = 'Copied!';
    status.textContent = 'Copied to clipboard. Paste it into your password manager.';
  } catch {
    if (revision !== copyRevision) return;
    output.type = 'text';
    $('reveal').textContent = 'Hide';
    $('reveal').setAttribute('aria-label', 'Hide password');
    $('reveal').setAttribute('aria-pressed', 'true');
    output.focus();
    output.select();
    status.textContent = 'Automatic copy is unavailable. Press Ctrl+C (or ⌘C) to copy the selected password.';
  }
});
generate();
