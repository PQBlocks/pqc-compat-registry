// Documentation generation test (doc validation).
// Per documentation requirements: outputs `docs/`, tests: 1 doc validation test.
//
// The generator module (src/docs_generator.ts) must produce documentation
// derived from the canonical registry data — never hand-written prose that
// could drift from the registry.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateDocs } from '../src/docs_generator.ts';
import { algorithms } from '../src/registry.ts';

const LANE_DIR = fileURLToPath(new URL('..', import.meta.url));
const DOCS_DIR = join(LANE_DIR, 'docs');

test('generateDocs() produces a complete markdown document from the registry', () => {
  const doc = generateDocs();

  // Heading and every one of the 21 registered algorithms present
  assert.match(doc, /^# PQC Algorithm Identifier Registry/, 'doc must open with the registry title');
  for (const [key, spec] of Object.entries(algorithms)) {
    assert.ok(doc.includes(key), `doc must contain algorithm key '${key}'`);
    assert.ok(doc.includes(spec.oid_dotted), `doc must contain OID ${spec.oid_dotted} for ${key}`);
    assert.ok(doc.includes(String(spec.security_lambda)), `doc must contain lambda ${spec.security_lambda} for ${key}`);
  }
  // No placeholder text left behind
  assert.ok(!doc.includes('TODO'), 'generated docs must not contain TODO placeholders');
  assert.ok(!doc.includes('undefined'), 'generated docs must not contain undefined');
});

test('generateDocs() includes usage sections for the public API', () => {
  const doc = generateDocs();
  assert.match(doc, /## API/, 'doc must include an API usage section');
  for (const fn of ['parse_oid', 'validate_oid', 'get_oid_by_algorithm', 'validate_parameter_sizes', 'validate_slh_dsa_sizes']) {
    assert.ok(doc.includes(fn), `doc must document exported function ${fn}`);
  }
});

test('the committed docs/index.md matches generateDocs() output exactly (no drift)', () => {
  const path = join(DOCS_DIR, 'index.md');
  assert.ok(existsSync(path), 'docs/index.md must exist on disk');
  assert.equal(readFileSync(path, 'utf8'), generateDocs());
});
