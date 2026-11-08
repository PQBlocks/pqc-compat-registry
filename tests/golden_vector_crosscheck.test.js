import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate_parameter_sizes } from '../src/parameter_validator.ts';
import { validate_slh_dsa_sizes } from '../src/slh_validator.ts';

const mlkemVectors = JSON.parse(readFileSync(new URL('./golden_vectors_mlkem.json', import.meta.url), 'utf8'));
const slhdsaVectors = JSON.parse(readFileSync(new URL('./golden_vectors_slhdsa.json', import.meta.url), 'utf8'));

describe('Golden vector cross-validation', () => {
  it('ML-KEM vectors pass parameter validator', () => {
    for (const v of mlkemVectors.test_vectors) {
      const sizes = {
        encapsulation_key: v.encapsulation_key,
        decapsulation_key: v.decapsulation_key,
        ciphertext: v.ciphertext,
        shared_secret: v.shared_secret
      };
      const r = validate_parameter_sizes(v.algorithm, sizes);
      assert.ok(r.valid, `ML-KEM ${v.algorithm} should be valid`);
    }
  });

  it('SLH-DSA vectors pass SLH-DSA validator', () => {
    for (const v of slhdsaVectors.test_vectors) {
      const sizes = {
        private_key: v.private_key,
        public_key: v.public_key,
        signature: v.signature
      };
      const r = validate_slh_dsa_sizes(v.algorithm, sizes);
      assert.ok(r.valid, `SLH-DSA ${v.algorithm} should be valid`);
    }
  });

  it('both validators agree on FIPS-correct inputs (no contradictions)', () => {
    // Cross-check that parameter_validator and slh_validator agree on the size tables
    for (const v of slhdsaVectors.test_vectors) {
      const paramResult = validate_parameter_sizes(v.algorithm, {
        private_key: v.private_key,
        public_key: v.public_key,
        signature: v.signature
      });
      const slhResult = validate_slh_dsa_sizes(v.algorithm, {
        private_key: v.private_key,
        public_key: v.public_key,
        signature: v.signature
      });
      assert.ok(paramResult.valid, `parameter_validator should accept ${v.algorithm}`);
      assert.ok(slhResult.valid, `slh_validator should accept ${v.algorithm}`);
    }
  });
});
