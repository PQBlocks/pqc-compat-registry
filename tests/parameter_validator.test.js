// tests/parameter_validator.test.js - Unit tests for FIPS 203/204/205 parameter size validation
// Uses Node.js built-in test runner (node:test + node:assert)
'use strict';

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// These imports will fail initially (RED phase) - parameter_validator.ts doesn't exist yet
let validator;
let { validate_parameter_sizes, get_expected_sizes, FIPS_TABLES } = {};

describe('FIPS 203/204/205 Parameter Size Validation', function() {
  before(async function() {
    // Dynamic import to catch module load errors cleanly
    try {
      validator = await import('../dist/parameter_validator.js');
      validate_parameter_sizes = validator.validate_parameter_sizes;
      get_expected_sizes = validator.get_expected_sizes;
      FIPS_TABLES = validator.FIPS_TABLES;
    } catch (e) {
      // Expected in RED phase - parameter_validator.ts doesn't exist yet
      console.log('RED phase: parameter_validator.ts not yet implemented');
    }
  });

  describe('FIPS_TABLES constant', function() {
    it('should expose FIPS 203 Table 3 (ML-KEM sizes)', function() {
      assert.ok(FIPS_TABLES, 'FIPS_TABLES should exist');
      assert.ok(FIPS_TABLES.fips203, 'FIPS 203 table should exist');
      
      // ML-KEM-512
      assert.equal(FIPS_TABLES.fips203['ml-kem-512'].encapsulation_key, 800);
      assert.equal(FIPS_TABLES.fips203['ml-kem-512'].decapsulation_key, 1632);
      assert.equal(FIPS_TABLES.fips203['ml-kem-512'].ciphertext, 768);
      assert.equal(FIPS_TABLES.fips203['ml-kem-512'].shared_secret, 32);
      
      // ML-KEM-768
      assert.equal(FIPS_TABLES.fips203['ml-kem-768'].encapsulation_key, 1184);
      assert.equal(FIPS_TABLES.fips203['ml-kem-768'].decapsulation_key, 2400);
      assert.equal(FIPS_TABLES.fips203['ml-kem-768'].ciphertext, 1088);
      assert.equal(FIPS_TABLES.fips203['ml-kem-768'].shared_secret, 32);
      
      // ML-KEM-1024
      assert.equal(FIPS_TABLES.fips203['ml-kem-1024'].encapsulation_key, 1568);
      assert.equal(FIPS_TABLES.fips203['ml-kem-1024'].decapsulation_key, 3168);
      assert.equal(FIPS_TABLES.fips203['ml-kem-1024'].ciphertext, 1568);
      assert.equal(FIPS_TABLES.fips203['ml-kem-1024'].shared_secret, 32);
    });

    it('should expose FIPS 204 Table 2 (ML-DSA sizes)', function() {
      assert.ok(FIPS_TABLES.fips204, 'FIPS 204 table should exist');
      
      // ML-DSA-44: private=2560, public=1312, signature=2420
      assert.equal(FIPS_TABLES.fips204['ml-dsa-44'].private_key, 2560);
      assert.equal(FIPS_TABLES.fips204['ml-dsa-44'].public_key, 1312);
      assert.equal(FIPS_TABLES.fips204['ml-dsa-44'].signature, 2420);
      
      // ML-DSA-65: private=4032, public=1952, signature=3309
      assert.equal(FIPS_TABLES.fips204['ml-dsa-65'].private_key, 4032);
      assert.equal(FIPS_TABLES.fips204['ml-dsa-65'].public_key, 1952);
      assert.equal(FIPS_TABLES.fips204['ml-dsa-65'].signature, 3309);
      
      // ML-DSA-87: private=4896, public=2592, signature=4627
      assert.equal(FIPS_TABLES.fips204['ml-dsa-87'].private_key, 4896);
      assert.equal(FIPS_TABLES.fips204['ml-dsa-87'].public_key, 2592);
      assert.equal(FIPS_TABLES.fips204['ml-dsa-87'].signature, 4627);
    });

    it('should expose FIPS 205 Table 2 (SLH-DSA sizes)', function() {
      assert.ok(FIPS_TABLES.fips205, 'FIPS 205 table should exist');
      
      // SLH-DSA-SHA2-128s: private=64, public=32, signature=7856
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-128s'].private_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-128s'].public_key, 32);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-128s'].signature, 7856);
      
      // SLH-DSA-SHA2-128f: private=64, public=32, signature=17088
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-128f'].private_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-128f'].public_key, 32);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-128f'].signature, 17088);
      
      // SLH-DSA-SHA2-192s: private=96, public=48, signature=16224
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-192s'].private_key, 96);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-192s'].public_key, 48);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-192s'].signature, 16224);
      
      // SLH-DSA-SHA2-192f: private=96, public=48, signature=35664
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-192f'].private_key, 96);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-192f'].public_key, 48);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-192f'].signature, 35664);
      
      // SLH-DSA-SHA2-256s: private=128, public=64, signature=29792
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-256s'].private_key, 128);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-256s'].public_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-256s'].signature, 29792);
      
      // SLH-DSA-SHA2-256f: private=128, public=64, signature=49856
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-256f'].private_key, 128);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-256f'].public_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-sha2-256f'].signature, 49856);
      
      // SLH-DSA-SHAKE-128s: private=64, public=32, signature=7856
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-128s'].private_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-128s'].public_key, 32);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-128s'].signature, 7856);
      
      // SLH-DSA-SHAKE-128f: private=64, public=32, signature=17088
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-128f'].private_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-128f'].public_key, 32);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-128f'].signature, 17088);
      
      // SLH-DSA-SHAKE-192s: private=96, public=48, signature=16224
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-192s'].private_key, 96);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-192s'].public_key, 48);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-192s'].signature, 16224);
      
      // SLH-DSA-SHAKE-192f: private=96, public=48, signature=35664
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-192f'].private_key, 96);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-192f'].public_key, 48);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-192f'].signature, 35664);
      
      // SLH-DSA-SHAKE-256s: private=128, public=64, signature=29792
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-256s'].private_key, 128);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-256s'].public_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-256s'].signature, 29792);
      
      // SLH-DSA-SHAKE-256f: private=128, public=64, signature=49856
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-256f'].private_key, 128);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-256f'].public_key, 64);
      assert.equal(FIPS_TABLES.fips205['slh-dsa-shake-256f'].signature, 49856);
    });
  });

  describe('get_expected_sizes()', function() {
    it('should return expected sizes for ML-KEM algorithms', function() {
      assert.ok(get_expected_sizes, 'get_expected_sizes function should exist');
      
      const kem512 = get_expected_sizes('ml-kem-512');
      assert.equal(kem512.encapsulation_key, 800);
      assert.equal(kem512.decapsulation_key, 1632);
      assert.equal(kem512.ciphertext, 768);
      assert.equal(kem512.shared_secret, 32);
      
      const kem768 = get_expected_sizes('ml-kem-768');
      assert.equal(kem768.encapsulation_key, 1184);
      assert.equal(kem768.decapsulation_key, 2400);
      assert.equal(kem768.ciphertext, 1088);
      assert.equal(kem768.shared_secret, 32);
    });

    it('should return expected sizes for ML-DSA algorithms', function() {
      const dsa44 = get_expected_sizes('ml-dsa-44');
      assert.equal(dsa44.private_key, 2560);
      assert.equal(dsa44.public_key, 1312);
      assert.equal(dsa44.signature, 2420);
      
      const dsa65 = get_expected_sizes('ml-dsa-65');
      assert.equal(dsa65.private_key, 4032);
      assert.equal(dsa65.public_key, 1952);
      assert.equal(dsa65.signature, 3309);
    });

    it('should return expected sizes for SLH-DSA algorithms', function() {
      const slh128s = get_expected_sizes('slh-dsa-sha2-128s');
      assert.equal(slh128s.private_key, 64);
      assert.equal(slh128s.public_key, 32);
      assert.equal(slh128s.signature, 7856);
      
      const slh256f = get_expected_sizes('slh-dsa-shake-256f');
      assert.equal(slh256f.private_key, 128);
      assert.equal(slh256f.public_key, 64);
      assert.equal(slh256f.signature, 49856);
    });

    it('should throw E_NOT_REGISTERED for unknown algorithm', function() {
      assert.throws(
        () => get_expected_sizes('unknown-algorithm'),
        /E_NOT_REGISTERED/,
        'Unknown algorithm should throw E_NOT_REGISTERED'
      );
    });
  });

  describe('validate_parameter_sizes()', function() {
    it('should validate correct ML-KEM sizes and return {valid: true}', function() {
      assert.ok(validate_parameter_sizes, 'validate_parameter_sizes function should exist');
      
      const result = validate_parameter_sizes('ml-kem-768', {
        encapsulation_key: 1184,
        decapsulation_key: 2400,
        ciphertext: 1088,
        shared_secret: 32
      });
      assert.deepEqual(result, { valid: true });
    });

    it('should validate correct ML-DSA sizes and return {valid: true}', function() {
      const result = validate_parameter_sizes('ml-dsa-65', {
        private_key: 4032,
        public_key: 1952,
        signature: 3309
      });
      assert.deepEqual(result, { valid: true });
    });

    it('should validate correct SLH-DSA sizes and return {valid: true}', function() {
      const result = validate_parameter_sizes('slh-dsa-sha2-128s', {
        private_key: 64,
        public_key: 32,
        signature: 7856
      });
      assert.deepEqual(result, { valid: true });
    });

    it('should return {valid: false, errors: [...]} for mismatched ML-KEM sizes', function() {
      const result = validate_parameter_sizes('ml-kem-768', {
        encapsulation_key: 1000,  // wrong
        decapsulation_key: 2400,
        ciphertext: 1088,
        shared_secret: 32
      });
      assert.equal(result.valid, false);
      assert.ok(Array.isArray(result.errors));
      assert.ok(result.errors.some(e => e.includes('encapsulation_key')));
    });

    it('should return {valid: false, errors: [...]} for mismatched ML-DSA sizes', function() {
      const result = validate_parameter_sizes('ml-dsa-65', {
        private_key: 4032,
        public_key: 2000,  // wrong
        signature: 3309
      });
      assert.equal(result.valid, false);
      assert.ok(Array.isArray(result.errors));
      assert.ok(result.errors.some(e => e.includes('public_key')));
    });

    it('should return {valid: false, errors: [...]} for mismatched SLH-DSA sizes', function() {
      const result = validate_parameter_sizes('slh-dsa-sha2-128s', {
        private_key: 32,
        public_key: 7856,
        signature: 8000  // wrong
      });
      assert.equal(result.valid, false);
      assert.ok(Array.isArray(result.errors));
      assert.ok(result.errors.some(e => e.includes('signature')));
    });

    it('should throw E_NOT_REGISTERED for unknown algorithm', function() {
      assert.throws(
        () => validate_parameter_sizes('unknown-algorithm', {}),
        /E_NOT_REGISTERED/,
        'Unknown algorithm should throw E_NOT_REGISTERED'
      );
    });

    it('should validate against registry entries for all 21 algorithms', function() {
      // This ensures the validator is consistent with the core registry
      const allAlgorithms = [
        'ml-kem-512', 'ml-kem-768', 'ml-kem-1024',
        'ml-dsa-44', 'ml-dsa-65', 'ml-dsa-87',
        'slh-dsa-sha2-128s', 'slh-dsa-sha2-128f', 'slh-dsa-sha2-192s', 'slh-dsa-sha2-192f', 'slh-dsa-sha2-256s', 'slh-dsa-sha2-256f',
        'slh-dsa-shake-128s', 'slh-dsa-shake-128f', 'slh-dsa-shake-192s', 'slh-dsa-shake-192f', 'slh-dsa-shake-256s', 'slh-dsa-shake-256f'
      ];
      
      for (const algo of allAlgorithms) {
        const expected = get_expected_sizes(algo);
        const result = validate_parameter_sizes(algo, expected);
        assert.equal(result.valid, true, `Algorithm ${algo} should validate against its own expected sizes`);
      }
    });
  });

  describe('Negative tests - edge cases', function() {
    it('should reject sizes with missing required fields', function() {
      const result = validate_parameter_sizes('ml-kem-768', {
        encapsulation_key: 1184,
        // missing decapsulation_key, ciphertext, shared_secret
      });
      assert.equal(result.valid, false);
      assert.ok(result.errors.length > 0);
    });

    it('should reject sizes with extra unexpected fields gracefully', function() {
      // Extra fields should not cause false negatives - only validate expected fields
      const result = validate_parameter_sizes('ml-kem-768', {
        encapsulation_key: 1184,
        decapsulation_key: 2400,
        ciphertext: 1088,
        shared_secret: 32,
        extra_field: 'ignored'
      });
      assert.equal(result.valid, true);
    });

    it('should handle zero or negative sizes as invalid', function() {
      const result = validate_parameter_sizes('ml-kem-768', {
        encapsulation_key: 0,
        decapsulation_key: 2400,
        ciphertext: 1088,
        shared_secret: 32
      });
      assert.equal(result.valid, false);
    });
  });
});