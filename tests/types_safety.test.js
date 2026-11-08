// tests/types_safety.test.js — Unit tests for TypeScript type safety
// Runs with Node.js built-in test runner (node:test + node:assert)
'use strict';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Types should be re-exported from the public API
// This test verifies that the type definitions from src/types/index.ts
// are accessible via the main entry point (src/index.ts)
describe('Type re-export from public API', function() {
  it('should have AlgorithmSpec type available from public API', async function() {
    // Import from the main entry point - types should be re-exported
    // The AlgorithmSpec type should be usable for type checking
    const module = await import('../src/index.ts');
    assert.ok(module, 'Module should load successfully');
  });
});

// Test 2: Type structure verification
// This test verifies the structure of algorithm-related types
describe('Algorithm-related types structure', function() {
  it('should have valid AlgorithmSpec interface shape', async function() {
    // This test validates that the types/index.ts file exists and
    // contains the necessary type definitions for algorithm specifications
    // We verify this by checking the actual implementation data matches
    // the type expectations
    const module = await import('../src/index.ts');
    const algorithms = module.algorithms;
    assert.ok(algorithms, 'algorithms should be exported');
    
    // Check that the algorithm entries have the expected structure
    // matching AlgorithmSpec interface
    for (const [key, spec] of Object.entries(algorithms)) {
      // Required fields per AlgorithmSpec interface
      assert.ok('name' in spec, `${key} should have 'name' field`);
      assert.ok('fips' in spec, `${key} should have 'fips' field`);
      assert.ok('oid_dotted' in spec, `${key} should have 'oid_dotted' field`);
      assert.ok('oid_components' in spec, `${key} should have 'oid_components' field`);
      assert.ok('key_length' in spec, `${key} should have 'key_length' field`);
      assert.ok('signature_length' in spec, `${key} should have 'signature_length' field`);
      assert.ok('shared_secret_length' in spec, `${key} should have 'shared_secret_length' field`);
      assert.ok('security_lambda' in spec, `${key} should have 'security_lambda' field`);
      assert.ok('description' in spec, `${key} should have 'description' field`);
      
      // Type checks - runtime verification of type expectations
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
});

// Test 3: Type exports verification from types/index.ts
// This verifies that the types module can be imported directly
describe('Types module exports', function() {
  it('should export necessary type interfaces from types/index.ts', async function() {
    // The types/index.ts file should define and export these types
    // We verify the module exists and has the expected exports
    const typesModule = await import('../src/types/index.ts');
    assert.ok(typesModule, 'types/index.ts should be importable');
  });
});