// tests/scaffolding.test.js — Unit tests for npm package scaffolding
// Uses Node.js built-in test runner (node:test + node:assert)
'use strict';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('NPM Package Scaffolding', function() {
  const pkgPath = path.resolve('./package.json');
  const readmePath = path.resolve('./README.md');
  const indexPath = path.resolve('./src/index.ts');

  it('should have package.json with correct metadata', function() {
    const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgContent);

    assert.equal(pkg.name, '@pqblocks/pqc-compat-registry');
    assert.equal(pkg.version, '1.0.0');
    assert.ok(pkg.description?.includes('PQC Algorithm Identifier Registry') || pkg.description?.includes('registry of NIST post-quantum algorithm identifiers'));
    assert.equal(pkg.type, 'module');
    assert.equal(pkg.main, 'dist/index.js');
    assert.equal(pkg.module, 'dist/index.js');
    assert.equal(pkg.types, 'dist/index.d.ts');
    assert.equal(pkg.license, 'Apache-2.0');
    assert.ok(pkg.author?.includes('PQBlocks'));
    assert.ok(pkg.repository?.url?.toLowerCase().includes('github.com/pqblocks/pqc-compat-registry'));
    assert.ok(pkg.keywords?.includes('pqc'));
    assert.ok(pkg.keywords?.includes('post-quantum'));
    assert.ok(pkg.keywords?.includes('fips-203'));
    assert.ok(pkg.keywords?.includes('fips-204'));
    assert.ok(pkg.keywords?.includes('fips-205'));
    assert.ok(pkg.engines?.node?.includes('>=20'));
    assert.ok(pkg.scripts?.build === 'tsc');
    assert.ok(pkg.scripts?.test);
    assert.ok(pkg.scripts?.lint === 'tsc --noEmit');
    assert.ok(!pkg.scripts?.prepack || pkg.scripts?.prepack === 'npm run build');
    assert.ok(pkg.bin?.['pqc-registry'] === './bin/registry-cli.js');
    assert.ok(pkg.files?.includes('dist/'));
    assert.ok(pkg.files?.includes('bin/'));
    assert.ok(pkg.files?.includes('README.md'));
    assert.ok(pkg.files?.includes('LICENSE'));
    assert.ok(!pkg.devDependencies || pkg.devDependencies?.typescript);
    assert.ok(!pkg.devDependencies || pkg.devDependencies?.['@types/node']);
  });

  it('should have README.md with required sections', function() {
    const readme = fs.readFileSync(readmePath, 'utf-8');

    assert.ok(readme.includes('@pqblocks/pqc-compat-registry'));
    assert.ok(readme.includes('FIPS 203'));
    assert.ok(readme.includes('FIPS 204'));
    assert.ok(readme.includes('FIPS 205'));
    assert.ok(readme.includes('RFC 9881'));
    assert.ok(readme.includes('RFC 9909'));
    assert.ok(readme.includes('RFC 9935'));
    assert.ok(readme.includes('SLH-DSA'));
    assert.ok(readme.includes('npm install @pqblocks/pqc-compat-registry'));
    assert.ok(readme.includes('validate_parameter_sizes'));
    assert.ok(readme.includes('Apache-2.0'));
  });

  it('should have src/index.ts as public API entry point', function() {
    const indexTs = fs.readFileSync(indexPath, 'utf-8');

    // Core registry exports
    assert.ok(indexTs.includes("export { Algorithm, AlgorithmSpec, Registry } from './registry.ts'"));
    // OID parsing exports
    assert.ok(indexTs.includes("export { parse_oid, validate_oid, is_slh_dsa_oid, get_oid_by_algorithm, OIDResult } from './oid_parser.ts'"));
    // Parameter validator exports
    assert.ok(indexTs.includes("export { validate_parameter_sizes, FIPS_TABLES, ExpectedSizes, SizeValidationResult } from './parameter_validator.ts'"));
    // SLH-DSA validator exports
    assert.ok(indexTs.includes("export { validate_slh_dsa_sizes, SLHDSASizes, SLHDSASizeValidation } from './slh_validator.ts'"));
    // Package metadata
    assert.ok(indexTs.includes("export * from '../package.json'"));
    // Version and info
    assert.ok(indexTs.includes("export const version = '1.0.0'"));
    assert.ok(indexTs.includes("export const license = 'Apache-2.0'"));
    assert.ok(indexTs.includes("export const description ="));
    // Feature exports
    assert.ok(indexTs.includes('export function ping(): boolean { return true; }'));
    assert.ok(indexTs.includes("export function hello(name: string): string"));
    assert.ok(indexTs.includes('export interface FeatureRegistry'));
    assert.ok(indexTs.includes('export const enum Feature'));
    assert.ok(indexTs.includes('export class FeatureClass'));
    // Bulk exports
    assert.ok(indexTs.includes('export const ALL_ALGORITHMS: ReadonlyArray<string>'));
    assert.ok(indexTs.includes("'ml-kem-512', 'ml-kem-768', 'ml-kem-1024'"));
    assert.ok(indexTs.includes("'ml-dsa-44', 'ml-dsa-65', 'ml-dsa-87'"));
    assert.ok(indexTs.includes("'slh-dsa-sha2-128s', 'slh-dsa-sha2-128f'"));
    assert.ok(indexTs.includes("'slh-dsa-shake-128s', 'slh-dsa-shake-128f'"));
    assert.ok(indexTs.includes('export const ALL_OIDS: ReadonlyArray<string>'));
    assert.ok(indexTs.includes("'2.16.840.1.101.3.4.4.1'"));
    assert.ok(indexTs.includes("'2.16.840.1.101.3.4.4.3'"));
  });

  it('should have exports field in package.json matching index.ts exports', function() {
    const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgContent);

    assert.ok(pkg.exports);
    assert.ok(pkg.exports['.']);
    assert.ok(pkg.exports['.'].import === './dist/index.js');
    assert.ok(pkg.exports['.'].types === './dist/index.d.ts');
    assert.ok(pkg.exports['./oid']);
    assert.ok(pkg.exports['./oid'].import === './dist/oid_parser.js');
    assert.ok(pkg.exports['./oid'].types === './dist/oid_parser.d.ts');
    assert.ok(pkg.exports['./parameters']);
    assert.ok(pkg.exports['./parameters'].import === './dist/parameter_validator.js');
    assert.ok(pkg.exports['./parameters'].types === './dist/parameter_validator.d.ts');
    assert.ok(pkg.exports['./slh-dsa']);
    assert.ok(pkg.exports['./slh-dsa'].import === './dist/slh_validator.js');
    assert.ok(pkg.exports['./slh-dsa'].types === './dist/slh_validator.d.ts');
  });
});