// tests/slh_validator.test.js - Unit tests for SLH-DSA (FIPS 205) parameter size validation
// Uses Node.js built-in test runner (node:test + node:assert)
// Follows the same pattern as tests/parameter_validator.test.js
'use strict';

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// These imports fail in RED phase - slh_validator.ts doesn't exist yet
let validator;
let { validate_slh_dsa_sizes, get_expected_slh_sizes, SLH_DSA_TABLES } = {};

describe('SLH-DSA (FIPS 205) Parameter Size Validation', function() {
  before(async function() {
    try {
      validator = await import('../dist/slh_validator.js');
      validate_slh_dsa_sizes = validator.validate_slh_dsa_sizes;
      get_expected_slh_sizes = validator.get_expected_slh_sizes;
      SLH_DSA_TABLES = validator.SLH_DSA_TABLES;
    } catch (e) {
      // Expected in RED phase - slh_validator.ts not yet implemented
      console.log('RED phase: slh_validator.ts not yet implemented -', e.message);
    }
  });

  describe('SLH_DSA_TABLES constant', function() {
    it('should expose FIPS 205 Table 2 with all 12 SLH-DSA parameter sets', function() {
      assert.ok(SLH_DSA_TABLES, 'SLH_DSA_TABLES should exist');
      assert.ok(SLH_DSA_TABLES.fips205, 'FIPS 205 table should exist');

      const expected = [
        'slh-dsa-sha2-128s', 'slh-dsa-sha2-128f',
        'slh-dsa-sha2-192s', 'slh-dsa-sha2-192f',
        'slh-dsa-sha2-256s', 'slh-dsa-sha2-256f',
        'slh-dsa-shake-128s', 'slh-dsa-shake-128f',
        'slh-dsa-shake-192s', 'slh-dsa-shake-192f',
        'slh-dsa-shake-256s', 'slh-dsa-shake-256f',
      ];
      for (const algo of expected) {
        assert.ok(SLH_DSA_TABLES.fips205[algo], `Missing entry for ${algo}`);
        assert.equal(typeof SLH_DSA_TABLES.fips205[algo].private_key, 'number');
        assert.equal(typeof SLH_DSA_TABLES.fips205[algo].public_key, 'number');
        assert.equal(typeof SLH_DSA_TABLES.fips205[algo].signature, 'number');
      }
    });

    it('should have correct sizes for SLH-DSA-SHA2-128s (n=16, category 1)', function() {
      const t = SLH_DSA_TABLES.fips205['slh-dsa-sha2-128s'];
      assert.equal(t.private_key, 64);   // 4n = 4*16
      assert.equal(t.public_key, 32);    // 2n per FIPS 205 Table 2 pk bytes column
      assert.equal(t.signature, 7856);
    });

    it('should have correct sizes for SLH-DSA-SHA2-256f (n=32, category 5)', function() {
      const t = SLH_DSA_TABLES.fips205['slh-dsa-sha2-256f'];
      assert.equal(t.private_key, 128);  // 4n = 4*32
      assert.equal(t.public_key, 64);    // 2n per FIPS 205 Table 2 pk bytes column
      assert.equal(t.signature, 49856);
    });

    it('should have correct sizes for SLH-DSA-SHAKE-128s (n=16)', function() {
      const t = SLH_DSA_TABLES.fips205['slh-dsa-shake-128s'];
      assert.equal(t.private_key, 64);   // 4n
      assert.equal(t.public_key, 32);    // 2n
      assert.equal(t.signature, 7856);
    });
  });

  describe('get_expected_slh_sizes()', function() {
    it('should return expected sizes for a registered SLH-DSA algorithm', function() {
      assert.ok(get_expected_slh_sizes, 'get_expected_slh_sizes function should exist');

      const sizes = get_expected_slh_sizes('slh-dsa-sha2-128s');
      assert.equal(sizes.private_key, 64);
      assert.equal(sizes.public_key, 32);
      assert.equal(sizes.signature, 7856);
    });

    it('should throw E_NOT_REGISTERED for non-SLH-DSA algorithm', function() {
      assert.throws(
        () => get_expected_slh_sizes('ml-kem-768'),
        /E_NOT_REGISTERED/,
        'ML-KEM algorithm should not be in SLH-DSA tables'
      );
    });

    it('should throw E_NOT_REGISTERED for unknown algorithm', function() {
      assert.throws(
        () => get_expected_slh_sizes('unknown-algorithm'),
        /E_NOT_REGISTERED/
      );
    });
  });

  describe('validate_slh_dsa_sizes()', function() {
    it('should return {valid: true} for correct SLH-DSA-SHA2-128s sizes', function() {
      assert.ok(validate_slh_dsa_sizes, 'validate_slh_dsa_sizes function should exist');

      const result = validate_slh_dsa_sizes('slh-dsa-sha2-128s', {
        private_key: 64,
        public_key: 32,
        signature: 7856,
      });
      assert.deepEqual(result, { valid: true });
    });

    it('should return {valid: true} for correct SLH-DSA-SHAKE-256f sizes', function() {
      const result = validate_slh_dsa_sizes('slh-dsa-shake-256f', {
        private_key: 128,
        public_key: 64,
        signature: 49856,
      });
      assert.deepEqual(result, { valid: true });
    });

    it('should return {valid: false, errors} for mismatched signature size', function() {
      const result = validate_slh_dsa_sizes('slh-dsa-sha2-128s', {
        private_key: 64,
        public_key: 32,
        signature: 8000, // wrong
      });
      assert.equal(result.valid, false);
      assert.ok(Array.isArray(result.errors));
      assert.ok(result.errors.some((e) => e.includes('signature')));
    });

    it('should return {valid: false, errors} for missing required fields', function() {
      const result = validate_slh_dsa_sizes('slh-dsa-sha2-128s', {
        private_key: 64,
        // missing public_key and signature
      });
      assert.equal(result.valid, false);
      assert.ok(result.errors.length >= 2);
      assert.ok(result.errors.some((e) => e.includes('public_key')));
      assert.ok(result.errors.some((e) => e.includes('signature')));
    });

    it('should return {valid: false, errors} for NaN sizes', function() {
          const result = validate_slh_dsa_sizes('slh-dsa-sha2-128s', {
            private_key: NaN,
            public_key: 32,
            signature: 7856,
          });
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes('private_key')));
    });

    it('should ignore extra unexpected fields (only validate expected fields)', function() {
      const result = validate_slh_dsa_sizes('slh-dsa-sha2-128s', {
        private_key: 64,
        public_key: 32,
        signature: 7856,
        extra_field: 'ignored',
      });
      assert.deepEqual(result, { valid: true });
    });

    it('should validate all 12 SLH-DSA parameter sets against their own expected sizes', function() {
      const all = Object.keys(SLH_DSA_TABLES.fips205);
      assert.equal(all.length, 12, 'Should have exactly 12 SLH-DSA parameter sets');
      for (const algo of all) {
        const expected = get_expected_slh_sizes(algo);
        const result = validate_slh_dsa_sizes(algo, expected);
        assert.equal(result.valid, true, `${algo} should validate against its own expected sizes`);
      }
    });

    it('should throw E_NOT_REGISTERED for non-SLH-DSA algorithm', function() {
      assert.throws(
        () => validate_slh_dsa_sizes('ml-dsa-65', { private_key: 4032, public_key: 1952, signature: 3309 }),
        /E_NOT_REGISTERED/,
        'ML-DSA algorithm should not be validated by SLH-DSA validator'
      );
    });

    it('should throw E_NOT_REGISTERED for completely unknown algorithm', function() {
      assert.throws(
        () => validate_slh_dsa_sizes('fake-algo', {}),
        /E_NOT_REGISTERED/
      );
    });
  });
});
