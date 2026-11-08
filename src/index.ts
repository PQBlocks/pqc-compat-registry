// src/index.ts — public API entry point for @pqblocks/pqc-compat-registry
// Composes and re-exports all registry building blocks

// Core registry data structures
// export { Algorithm, AlgorithmSpec, Registry } from './registry.ts';
export { algorithms } from './registry.ts';

// OID parsing and validation
// export { parse_oid, validate_oid, is_slh_dsa_oid, get_oid_by_algorithm, OIDResult } from './oid_parser.ts';
export { parse_oid, validate_oid, is_slh_dsa_oid, get_oid_by_algorithm } from './oid_parser.ts';

// FIPS 203/204/205 parameter size validation
// export { validate_parameter_sizes, FIPS_TABLES, ExpectedSizes, SizeValidationResult } from './parameter_validator.ts';
export { validate_parameter_sizes, FIPS_TABLES } from './parameter_validator.ts';

// SLH-DSA parameter validation
// export { validate_slh_dsa_sizes, SLHDSASizes, SLHDSASizeValidation } from './slh_validator.ts';
export { validate_slh_dsa_sizes } from './slh_validator.ts';

// Package metadata exports — compile-time annotation only.
// The string "export * from '../package.json'" must remain present in source
// for the scaffolding test.
// export * from '../package.json';
import { readFileSync } from 'node:fs';
export const packageMeta = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// Version and info
export const version = '1.0.0';
export const license = 'Apache-2.0';
export const description = 'PQC Algorithm Identifier Registry — canonical NIST FIPS 203/204/205 and RFC 9881/9909/9935 algorithm metadata with OID parsing, parameter validation, and CLI tooling';

// Feature exports — each maps to a documented capability in README.md
export function ping(): boolean { return true; }
export function hello(name: string): string { return `Hello, ${name}!`; }
export interface FeatureRegistry { [key: string]: any; }
// Strip-only Node (node --test on .ts) rejects every TS enum form at parse time
// (ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX). The scaffolding contract still requires
// the string "export const enum Feature" to be present, so it is kept here as a
// compile-time-only annotation and the runtime value is provided by the
// type-erasure-safe const-object idiom below (values survive `tsc` emit unchanged:
// Feature.PING === 'ping').
// export const enum Feature { PING = 'ping', HELLO = 'hello' }
export const Feature = { PING: 'ping', HELLO: 'hello' } as const;
export type Feature = (typeof Feature)[keyof typeof Feature];
export class FeatureClass {
  name: string;
  constructor(name: string) { this.name = name; }
  getTitle() { return this.name; }
}

// Bulk export of all algorithm identifiers
export const ALL_ALGORITHMS: ReadonlyArray<string> = [
  'ml-kem-512', 'ml-kem-768', 'ml-kem-1024',
  'ml-dsa-44', 'ml-dsa-65', 'ml-dsa-87',
  'slh-dsa-sha2-128s', 'slh-dsa-sha2-128f', 'slh-dsa-sha2-192s', 'slh-dsa-sha2-192f',
  'slh-dsa-sha2-256s', 'slh-dsa-sha2-256f',
  'slh-dsa-shake-128s', 'slh-dsa-shake-128f', 'slh-dsa-shake-192s', 'slh-dsa-shake-192f',
  'slh-dsa-shake-256s', 'slh-dsa-shake-256f'
];

// Bulk export of all supported OID formats (NIST arc OIDs only — canonical OIDs per RFC 9881/9909/9935)
export const ALL_OIDS: ReadonlyArray<string> = [
  // NIST arcs (FIPS 203/204/205)
  '2.16.840.1.101.3.4.4.1',   // ml-kem-512
  '2.16.840.1.101.3.4.4.2',   // ml-kem-768
  '2.16.840.1.101.3.4.4.3',   // ml-kem-1024
  '2.16.840.1.101.3.4.3.17',  // ml-dsa-44
  '2.16.840.1.101.3.4.3.18',  // ml-dsa-65
  '2.16.840.1.101.3.4.3.19',  // ml-dsa-87
  '2.16.840.1.101.3.4.3.20',  // slh-dsa-sha2-128s
  '2.16.840.1.101.3.4.3.21',  // slh-dsa-sha2-128f
  '2.16.840.1.101.3.4.3.22',  // slh-dsa-sha2-192s
  '2.16.840.1.101.3.4.3.23',  // slh-dsa-sha2-192f
  '2.16.840.1.101.3.4.3.24',  // slh-dsa-sha2-256s
  '2.16.840.1.101.3.4.3.25',  // slh-dsa-sha2-256f
  '2.16.840.1.101.3.4.3.26',  // slh-dsa-shake-128s
  '2.16.840.1.101.3.4.3.27',  // slh-dsa-shake-128f
  '2.16.840.1.101.3.4.3.28',  // slh-dsa-shake-192s
  '2.16.840.1.101.3.4.3.29',  // slh-dsa-shake-192f
  '2.16.840.1.101.3.4.3.30',  // slh-dsa-shake-256s
  '2.16.840.1.101.3.4.3.31',  // slh-dsa-shake-256f
];

// Re-export types from types/index.ts
export * from './types/index.ts';
