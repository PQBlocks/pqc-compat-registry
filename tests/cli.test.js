// tests/cli.test.js - Integration tests for CLI command interface
'use strict';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';

const CLI_PATH = './bin/registry-cli.js';

function runCli(args) {
  return execSync(['node', CLI_PATH, ...args].join(' '), {
    stdio: 'pipe',
    encoding: 'utf8',
    shell: true
  });
}

describe('CLI Command Interface', function() {
  describe('CLI parse command', function() {
    it('should parse a valid ML-KEM-768 OID and output JSON', function() {
      const output = runCli(['parse', '2.16.840.1.101.3.4.4.2']);
      assert.ok(output.includes('ML-KEM-768'), 'Should identify ML-KEM-768');
      assert.ok(output.includes('algorithm'), 'Should have algorithm field');
    });

    it('should show error for invalid OID format', function() {
      try {
        runCli(['parse', 'not-an-oid']);
        assert.fail('Should have thrown');
      } catch (e) {
        assert.ok(e.message.includes('E_INVALID_OID') || e.status === 1);
      }
    });

    it('should show error for unregistered OID', function() {
      try {
        runCli(['parse', '1.2.3.4.5']);
        assert.fail('Should have thrown');
      } catch (e) {
        assert.ok(e.message.includes('E_NOT_REGISTERED') || e.status === 1);
      }
    });
  });

  describe('CLI validate-oid command', function() {
    it('should validate a registered OID', function() {
      const output = runCli(['validate-oid', '2.16.840.1.101.3.4.4.2']);
      assert.ok(output.includes('✓ Valid OID'), 'Should show valid');
    });

    it('should reject an unregistered OID', function() {
      const output = runCli(['validate-oid', '1.2.3.4.5']);
      assert.ok(output.includes('✗ Invalid OID'), 'Should show invalid');
    });
  });

  describe('CLI lookup command', function() {
    it('should return OID for valid algorithm', function() {
      const output = runCli(['lookup', 'ml-kem-768']);
      assert.ok(output.includes('2.16.840.1.101.3.4.4.2'), 'Should return correct OID');
    });

    it('should show error for unknown algorithm', function() {
      try {
        runCli(['lookup', 'unknown-algorithm']);
        assert.fail('Should have thrown');
      } catch (e) {
        assert.ok(e.message.includes('E_NOT_REGISTERED') || e.status === 1);
      }
    });
  });

  describe('CLI validate-sizes command', function() {
    it('should validate correct ML-KEM-768 sizes', function() {
      const output = runCli([
        'validate-sizes', 'ml-kem-768',
        '--public-key', '1184',
        '--secret-key', '2400',
        '--ciphertext', '1088'
      ]);
      assert.ok(output.includes('✓ Sizes are valid'), 'Should validate correctly');
    });

    it('should reject mismatched ML-KEM-768 sizes', function() {
      try {
        runCli([
          'validate-sizes', 'ml-kem-768',
          '--public-key', '1000',
          '--secret-key', '2400',
          '--ciphertext', '1088'
        ]);
        assert.fail('Should have thrown');
      } catch (e) {
        assert.ok(e.message.includes('Invalid sizes') || e.status === 1);
      }
    });
  });

  describe('CLI help/usage', function() {
    it('should show usage when no command given', function() {
      try {
        runCli([]);
        assert.fail('Should have thrown');
      } catch (e) {
        assert.ok(e.message.includes('Usage') || e.status === 1);
      }
    });
  });

  describe('CLI list command', function() {
    it('should list all registered algorithms', function() {
      const output = runCli(['list']);
      assert.ok(output.includes('ml-kem-512'), 'Should include ml-kem-512');
      assert.ok(output.includes('ml-dsa-44'), 'Should include ml-dsa-44');
      assert.ok(output.includes('slh-dsa-sha2-128s'), 'Should include slh-dsa-sha2-128s');
    });

    it('should list algorithms at or below security level', function() {
      // --level uses the NIST security strength lambda (128/192/256), not category 1-3
      const output = runCli(['list', '--level', '128']);
      assert.ok(output.includes('ml-kem-512'), 'Should include ml-kem-512 at lambda 128');
      // ml-kem-1024 is lambda 256 and must not appear
      assert.ok(!output.includes('ml-kem-1024'), 'Should not include ml-kem-1024 at lambda 128');
    });

    it('should reject invalid level number', function() {
      try {
        runCli(['list', '--level', 'not-a-number']);
        assert.fail('Should have thrown');
      } catch (e) {
        assert.ok(e.message.includes('Level number required') || e.status === 1);
      }
    });
  });
});
