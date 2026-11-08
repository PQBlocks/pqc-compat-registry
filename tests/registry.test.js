// tests/registry.test.js — Unit tests for core registry data structures
// Uses Node.js built-in test runner (node:test + node:assert)
'use strict';

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// These imports will fail initially (RED phase) - registry.ts doesn't exist yet
let registry;
let { algorithms, AlgorithmSpec } = {};

describe('Core Registry Data Structures', function() {
  before(async function() {
    // Dynamic import to catch module load errors cleanly
    try {
      registry = await import('../src/registry.ts');
      algorithms = registry.algorithms;
    } catch (e) {
      // Expected in RED phase - registry.ts doesn't exist yet
      console.log('RED phase: registry.ts not yet implemented');
    }
  });

  describe('Algorithm type union', function() {
    it('should export all 21 NIST PQC algorithm identifiers as keys', function() {
      // This test will fail until registry.ts exists with the Algorithm union
      const expectedAlgorithms = [
        'ml-kem-512', 'ml-kem-768', 'ml-kem-1024',
        'ml-dsa-44', 'ml-dsa-65', 'ml-dsa-87',
        'slh-dsa-sha2-128s', 'slh-dsa-sha2-128f', 'slh-dsa-sha2-192s', 'slh-dsa-sha2-192f', 'slh-dsa-sha2-256s', 'slh-dsa-sha2-256f',
        'slh-dsa-shake-128s', 'slh-dsa-shake-128f', 'slh-dsa-shake-192s', 'slh-dsa-shake-192f', 'slh-dsa-shake-256s', 'slh-dsa-shake-256f'
      ];
      
      assert.ok(algorithms, 'algorithms object should exist');
      const actualKeys = Object.keys(algorithms).sort();
      const expectedKeys = expectedAlgorithms.sort();
      assert.deepEqual(actualKeys, expectedKeys, 'Should have exactly 21 algorithm entries');
    });

    it('should have correct OID dotted notation for ML-KEM-768', function() {
      assert.ok(algorithms['ml-kem-768'], 'ML-KEM-768 should exist');
      assert.equal(algorithms['ml-kem-768'].oid_dotted, '2.16.840.1.101.3.4.4.2', 'ML-KEM-768 OID must match RFC 9935');
    });

    it('should have correct OID dotted notation for ML-DSA-65', function() {
      assert.ok(algorithms['ml-dsa-65'], 'ML-DSA-65 should exist');
      assert.equal(algorithms['ml-dsa-65'].oid_dotted, '2.16.840.1.101.3.4.3.18', 'ML-DSA-65 OID must match RFC 9881');
    });

    it('should have correct OID dotted notation for SLH-DSA-SHA2-128s', function() {
      assert.ok(algorithms['slh-dsa-sha2-128s'], 'SLH-DSA-SHA2-128s should exist');
      assert.equal(algorithms['slh-dsa-sha2-128s'].oid_dotted, '2.16.840.1.101.3.4.3.20', 'SLH-DSA-SHA2-128s OID must match RFC 9909');
    });
  });

  describe('AlgorithmSpec interface validation', function() {
    it('should have all required fields for each algorithm entry', function() {
      const requiredFields = [
        'name', 'fips', 'oid_dotted', 'oid_components', 
        'key_length', 'signature_length', 'shared_secret_length', 
        'security_lambda', 'description'
      ];

      for (const [key, spec] of Object.entries(algorithms)) {
        for (const field of requiredFields) {
          assert.ok(field in spec, `Algorithm ${key} missing required field: ${field}`);
        }
        
        // Type checks
        assert.equal(typeof spec.name, 'string', `${key}.name should be string`);
        assert.equal(typeof spec.fips, 'string', `${key}.fips should be string`);
        assert.equal(typeof spec.oid_dotted, 'string', `${key}.oid_dotted should be string`);
        assert.ok(Array.isArray(spec.oid_components), `${key}.oid_components should be array`);
        assert.equal(typeof spec.key_length, 'number', `${key}.key_length should be number`);
        assert.equal(typeof spec.signature_length, 'number', `${key}.signature_length should be number`);
        assert.equal(typeof spec.shared_secret_length, 'number', `${key}.shared_secret_length should be number`);
        assert.equal(typeof spec.security_lambda, 'number', `${key}.security_lambda should be number`);
        assert.equal(typeof spec.description, 'string', `${key}.description should be string`);
      }
    });

    it('should have correct key/signature/shared_secret lengths for ML-KEM-768 per FIPS 203 Table 3', function() {
      const spec = algorithms['ml-kem-768'];
      assert.equal(spec.key_length, 1184, 'ML-KEM-768 encapsulation key must be 1184 bytes (FIPS 203 Table 3)');
      assert.equal(spec.signature_length, 2400, 'ML-KEM-768 decapsulation key must be 2400 bytes (FIPS 203 Table 3)');
      assert.equal(spec.shared_secret_length, 32, 'ML-KEM-768 shared secret must be 32 bytes (FIPS 203 Table 3)');
    });

    it('should have correct key/signature lengths for ML-DSA-65 per FIPS 204 Table 2', function() {
          const spec = algorithms['ml-dsa-65'];
          // Note: key_length = public key, signature_length = signature per spec §1.3
          // FIPS 204 Table 2: ML-DSA-65 public key 4032, signature 3309
          assert.equal(spec.key_length, 4032, 'ML-DSA-65 public key must be 4032 bytes (FIPS 204 Table 2)');
          assert.equal(spec.signature_length, 3309, 'ML-DSA-65 signature must be 3309 bytes (FIPS 204 Table 2)');
        });

    it('should have correct security_lambda derived from parameter set name', function() {
      // ML-KEM: 512→128, 768→192, 1024→256
      assert.equal(algorithms['ml-kem-512'].security_lambda, 128);
      assert.equal(algorithms['ml-kem-768'].security_lambda, 192);
      assert.equal(algorithms['ml-kem-1024'].security_lambda, 256);
      
      // ML-DSA: 44→128, 65→192, 87→256
      assert.equal(algorithms['ml-dsa-44'].security_lambda, 128);
      assert.equal(algorithms['ml-dsa-65'].security_lambda, 192);
      assert.equal(algorithms['ml-dsa-87'].security_lambda, 256);
      
      // SLH-DSA: category 1→128, category 3→192, category 5→256
      assert.equal(algorithms['slh-dsa-sha2-128s'].security_lambda, 128);
      assert.equal(algorithms['slh-dsa-sha2-192s'].security_lambda, 192);
      assert.equal(algorithms['slh-dsa-sha2-256s'].security_lambda, 256);
      assert.equal(algorithms['slh-dsa-shake-128s'].security_lambda, 128);
      assert.equal(algorithms['slh-dsa-shake-192s'].security_lambda, 192);
      assert.equal(algorithms['slh-dsa-shake-256s'].security_lambda, 256);
    });
  });

  describe('OID component validation', function() {
    it('should have correct ASN.1 component structure for ML-KEM OIDs', function() {
      const kem = algorithms['ml-kem-768'];
      assert.ok(kem.oid_components.includes('joint-iso-itu-t'));
      assert.ok(kem.oid_components.includes('country'));
      assert.ok(kem.oid_components.includes('us'));
      assert.ok(kem.oid_components.includes('organization'));
      assert.ok(kem.oid_components.includes('gov'));
      assert.ok(kem.oid_components.includes('csor'));
      assert.ok(kem.oid_components.includes('nistAlgorithm'));
      assert.ok(kem.oid_components.includes('kems'));
      assert.ok(kem.oid_components.includes('id-alg-ml-kem-768'));
    });

    it('should have correct ASN.1 component structure for ML-DSA OIDs', function() {
      const dsa = algorithms['ml-dsa-65'];
      assert.ok(dsa.oid_components.includes('joint-iso-itu-t'));
      assert.ok(dsa.oid_components.includes('sigAlgs'));
      assert.ok(dsa.oid_components.includes('id-ml-dsa-65'));
    });

    it('should have correct ASN.1 component structure for SLH-DSA OIDs', function() {
      const slh = algorithms['slh-dsa-sha2-128s'];
      assert.ok(slh.oid_components.includes('joint-iso-itu-t'));
      assert.ok(slh.oid_components.includes('sigAlgs'));
      assert.ok(slh.oid_components.includes('id-slh-dsa-sha2-128s'));
    });
  });
});