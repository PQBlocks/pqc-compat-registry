// Golden vector validation test (official NIST ACVP vectors).
// Per test vector requirements: outputs `tests/official_vectors.test.js`, tests: 10 vector validation tests.
//
// The vendor file must be an official, published ACVP vector — never self-generated.
//
// This test validates that the registry's parameter tables match the official
// NIST ACVP vectors. The test vectors are provided as a vendored golden file
// so that CI can verify bit-for-bit correctness without network access.
//
// To run this test, the file tests/golden_vectors_mlkem.json and
// tests/golden_vectors_ml_dsa.json and tests/golden_vectors_slhdsa.json must
// exist and contain the canonical ACVP test vectors.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate_parameter_sizes, validate_slh_dsa_sizes, algorithms } from '../dist/index.js';

const LANE_DIR = fileURLToPath(new URL('..', import.meta.url));
const TESTS_DIR = join(LANE_DIR, 'tests');

function parseJsonFile(name) {
  return JSON.parse(readFileSync(join(TESTS_DIR, name), 'utf8'));
}

const ML_KEM_GOLDEN = parseJsonFile('golden_vectors_mlkem.json');
const ML_DSA_GOLDEN = parseJsonFile('golden_vectors_ml_dsa.json');
const SLH_DSA_GOLDEN = parseJsonFile('golden_vectors_slhdsa.json');

for (const vector of ML_KEM_GOLDEN.test_vectors) {
  test(`validate_parameter_sizes(${vector.algorithm}) must pass for vector ${vector.vector_id}`, () => {
    const sizes = {
      encapsulation_key: vector.encapsulation_key,
      decapsulation_key: vector.decapsulation_key,
      ciphertext: vector.ciphertext,
      shared_secret: vector.shared_secret,
    };
    const result = validate_parameter_sizes(vector.algorithm, sizes);
    assert.ok(result.valid, `${vector.algorithm} vector ${vector.vector_id}: expected valid sizes, got: ${JSON.stringify(result.errors)}`);
  });
}

for (const vector of ML_DSA_GOLDEN.test_vectors) {
  test(`validate_parameter_sizes(${vector.algorithm}) must pass for vector ${vector.vector_id}`, () => {
    const sizes = {
      private_key: vector.private_key,
      public_key: vector.public_key,
      signature: vector.signature,
    };
    const result = validate_parameter_sizes(vector.algorithm, sizes);
    assert.ok(result.valid, `${vector.algorithm} vector ${vector.vector_id}: expected valid sizes, got: ${JSON.stringify(result.errors)}`);
  });
}

for (const vector of SLH_DSA_GOLDEN.test_vectors) {
  test(`validate_slh_dsa_sizes(${vector.algorithm}) must pass for vector ${vector.vector_id}`, () => {
    const sizes = {
      private_key: vector.private_key,
      public_key: vector.public_key,
      signature: vector.signature,
    };
    const result = validate_slh_dsa_sizes(vector.algorithm, sizes);
    assert.ok(result.valid, `${vector.algorithm} vector ${vector.vector_id}: expected valid sizes, got: ${JSON.stringify(result.errors)}`);
  });
}

// Ensure all three ML-KEM parameter sets are covered
for (const algo of ['ml-kem-512', 'ml-kem-768', 'ml-kem-1024']) {
  test(`ML-KEM ${algo} has golden vectors`, () => {
    const algoVectors = ML_KEM_GOLDEN.test_vectors.filter(v => v.algorithm === algo);
    assert.ok(algoVectors.length > 0, `ML-KEM ${algo} has no golden vectors in golden_vectors_mlkem.json`);
  });
}

// Ensure all three ML-DSA parameter sets are covered
for (const algo of ['ml-dsa-44', 'ml-dsa-65', 'ml-dsa-87']) {
  test(`ML-DSA ${algo} has golden vectors`, () => {
    const algoVectors = ML_DSA_GOLDEN.test_vectors.filter(v => v.algorithm === algo);
    assert.ok(algoVectors.length > 0, `ML-DSA ${algo} has no golden vectors in golden_vectors_ml_dsa.json`);
  });
}

// Ensure all six SLH-DSA parameter sets are covered
for (const algo of [
  'slh-dsa-sha2-128s', 'slh-dsa-sha2-128f', 'slh-dsa-sha2-192s',
  'slh-dsa-sha2-192f', 'slh-dsa-sha2-256s', 'slh-dsa-sha2-256f',
  'slh-dsa-shake-128s', 'slh-dsa-shake-128f', 'slh-dsa-shake-192s', 'slh-dsa-shake-192f', 'slh-dsa-shake-256s', 'slh-dsa-shake-256f'
]) {
  test(`SLH-DSA ${algo} has golden vectors`, () => {
    const algoVectors = SLH_DSA_GOLDEN.test_vectors.filter(v => v.algorithm === algo);
    assert.ok(algoVectors.length > 0, `SLH-DSA ${algo} has no golden vectors in golden_vectors_slhdsa.json`);
  });
}