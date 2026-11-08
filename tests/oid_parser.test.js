// tests/oid_parser.test.js - Unit tests for OID parsing and validation
// Uses Node.js built-in test runner (node:test + node:assert)
'use strict';

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// These imports will fail initially (RED phase) - oid_parser.ts doesn't exist yet
let parser;
let { parse_oid, validate_oid, get_oid_by_algorithm, is_slh_dsa_oid, list_all_oids } = {};

describe('OID Parsing and Validation', function() {
  before(async function() {
    // Dynamic import to catch module load errors cleanly
    try {
      parser = await import('../src/oid_parser.ts');
      parse_oid = parser.parse_oid;
      validate_oid = parser.validate_oid;
      get_oid_by_algorithm = parser.get_oid_by_algorithm;
      is_slh_dsa_oid = parser.is_slh_dsa_oid;
      list_all_oids = parser.list_all_oids;
    } catch (e) {
      // Expected in RED phase - oid_parser.ts doesn't exist yet
      console.log('RED phase: oid_parser.ts not yet implemented');
    }
  });

  describe('parse_oid() input validation', function() {
    it('should parse a valid ML-KEM-768 OID in dotted notation', function() {
      assert.ok(parse_oid, 'parse_oid function should exist');
      const result = parse_oid('2.16.840.1.101.3.4.4.2');
      assert.equal(result.algorithm, 'ml-kem-768');
    });

    it('should parse a valid ML-DSA-44 OID in dotted notation', function() {
      const result = parse_oid('2.16.840.1.101.3.4.3.17');
      assert.equal(result.algorithm, 'ml-dsa-44');
    });

    it('should parse a valid SLH-DSA-SHA2-128s OID in dotted notation', function() {
      const result = parse_oid('2.16.840.1.101.3.4.3.20');
      assert.equal(result.algorithm, 'slh-dsa-sha2-128s');
    });

    it('should return ASN.1 named components, algorithm name, lambda and FIPS metadata', function() {
      const result = parse_oid('2.16.840.1.101.3.4.4.2');
      assert.deepEqual(result.components, ['2', '16', '840', '1', '101', '3', '4', '4', '2']);
      assert.equal(result.algorithm_name, 'ML-KEM-768');
      assert.equal(result.security_lambda, 192);
      assert.equal(result.fips, 'FIPS 203');
      assert.ok(Array.isArray(result.oid_components));
    });

    it('should resolve all registered NIST PQC OIDs to their algorithm identifiers', function() {
      const allOids = list_all_oids();
      // spec Table 1 lists exactly 18 NIST FIPS 203/204/205 parameter sets (ML-KEM-512/768/1024, ML-DSA-44/65/87, SLH-DSA-*)
      assert.equal(allOids.length, 18, 'Should resolve all 18 OIDs from spec Table 1');
      for (const entry of allOids) {
        const result = parse_oid(entry.oid_dotted);
        assert.equal(result.algorithm, entry.algorithm);
      }
    });
  });

  describe('Negative tests - invalid inputs', function() {
    it('should throw E_INVALID_OID for empty string input', function() {
      assert.throws(
        () => parse_oid(''),
        /E_INVALID_OID/,
        'Empty string should throw E_INVALID_OID error'
      );
    });

    it('should throw E_INVALID_OID for whitespace-only string input', function() {
      assert.throws(
        () => parse_oid('   '),
        /E_INVALID_OID/,
        'Whitespace-only string should throw E_INVALID_OID error'
      );
    });

    it('should throw E_INVALID_OID for a malformed OID that is not dotted notation', function() {
      assert.throws(
        () => parse_oid('not-an-oid'),
        /E_INVALID_OID/,
        'Malformed OID should throw E_INVALID_OID error'
      );
    });

    it('should throw E_INVALID_OID for a single-component OID', function() {
      assert.throws(
        () => parse_oid('2'),
        /E_INVALID_OID/,
        'Single-component OID should throw E_INVALID_OID error'
      );
    });

    it('should throw E_NOT_REGISTERED for unknown OID dotted notation', function() {
      assert.throws(
        () => parse_oid('1.2.3.4.5'),
        /E_NOT_REGISTERED/,
        'Unknown OID should throw E_NOT_REGISTERED error'
      );
    });
  });

  describe('validate_oid()', function() {
    it('should return true for a registered OID', function() {
      assert.ok(validate_oid, 'validate_oid function should exist');
      assert.equal(validate_oid('2.16.840.1.101.3.4.4.1'), true);
    });

    it('should return false for an unregistered OID', function() {
      assert.equal(validate_oid('1.2.3.4.5'), false);
    });

    it('should return false for an empty OID', function() {
      assert.equal(validate_oid(''), false);
    });
  });

  describe('get_oid_by_algorithm()', function() {
    it('should return the dotted OID for a named algorithm', function() {
      assert.ok(get_oid_by_algorithm, 'get_oid_by_algorithm function should exist');
      assert.equal(get_oid_by_algorithm('ml-kem-768'), '2.16.840.1.101.3.4.4.2');
    });

    it('should round-trip with parse_oid for every registered algorithm', function() {
      const allOids = list_all_oids();
      for (const entry of allOids) {
        const oid = get_oid_by_algorithm(entry.algorithm);
        assert.equal(oid, entry.oid_dotted);
        const result = parse_oid(oid);
        assert.equal(result.algorithm, entry.algorithm);
      }
    });
  });

  describe('is_slh_dsa_oid()', function() {
    it('should return true for an SLH-DSA OID', function() {
      assert.ok(is_slh_dsa_oid, 'is_slh_dsa_oid function should exist');
      assert.equal(is_slh_dsa_oid('2.16.840.1.101.3.4.3.20'), true);
    });

    it('should return false for a non-SLH-DSA OID', function() {
      assert.equal(is_slh_dsa_oid('2.16.840.1.101.3.4.4.2'), false);
    });

    it('should return false for an unregistered OID', function() {
      assert.equal(is_slh_dsa_oid('1.2.3.4.5'), false);
    });
  });
});
