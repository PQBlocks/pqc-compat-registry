// src/oid_parser.ts — OID parsing and validation for PQC algorithm identifier registry
// Derives from RFC 9881/9935/9909 OID formats as defined in NIST FIPS 203/204/205.
// Composes with registry.ts.
// 
// Public API:
// - parse_oid(oidStr: string): OidParseResult
// - validate_oid(oidStr: string): boolean
// - get_oid_by_algorithm(algorithm: string): string
// - is_slh_dsa_oid(oidStr: string): boolean
// - list_all_oids(): { algorithm: string; oid_dotted: string }[]

import { algorithms } from './registry.ts';
import type { Algorithm } from './registry.ts';

export type OidParseResult = {
  components: string[];
  oid_components: string[];
  algorithm: string;
  algorithm_name: string;
  security_lambda: number;
  fips: string;
};

// Build OID-to-algorithm map from registry (single source of truth)
const OID_TO_ALGO: Record<string, Algorithm> = {};
for (const [algo, spec] of Object.entries(algorithms)) {
  OID_TO_ALGO[spec.oid_dotted] = algo as Algorithm;
}

/**
 * Parse an ASN.1 OID in dotted notation and return the identified algorithm metadata.
 *
 * @param oidStr - Dotted OID string (e.g., '2.16.840.1.101.3.4.4.1')
 * @returns {OidParseResult} Parsed result with numeric components, named components,
 *   algorithm, algorithm_name, security_lambda, fips
 * @throws {Error} Throws E_INVALID_OID for empty/whitespace input or malformed format
 * @throws {Error} Throws E_NOT_REGISTERED for syntactically valid but unrecognized OID
 *
 * @example
 * parse_oid('2.16.840.1.101.3.4.4.1') => { components: [...], oid_components: [...], algorithm: 'ml-kem-512', ... }
 */
export function parse_oid(oidStr: string): OidParseResult {
  // Input validation: reject empty or whitespace-only strings
  if (!oidStr || oidStr.trim() === '') {
    throw new Error('E_INVALID_OID: OID string must not be empty or whitespace-only');
  }

  // Look up in canonical registry
  const algo = OID_TO_ALGO[oidStr];
  if (algo) {
    const spec = algorithms[algo];
    return {
      components: oidStr.split('.'),
      oid_components: spec.oid_components,
      algorithm: algo,
      algorithm_name: spec.name,
      security_lambda: spec.security_lambda,
      fips: spec.fips,
    };
  }

  // Unknown OID - check if syntactically valid dotted OID
  const parts = oidStr.split('.');
  if (parts.length < 2 || !parts.every(p => /^\d+$/.test(p))) {
    throw new Error(`E_INVALID_OID: Invalid OID format: '${oidStr}'. OID must be in dotted notation (e.g., 2.16.840.1.101.3.4.4.1)`);
  }

  throw new Error(`E_NOT_REGISTERED: OID '${oidStr}' is not registered in the PQC algorithm identifier registry. See spec Table 1 for registered OIDs (RFC 9881/9935/9909).`);
}

/**
 * Validate an OID against the registry and return whether it's recognized.
 *
 * @param oidStr - Dotted OID string to validate
 * @returns true if the OID is registered, false otherwise
 */
export function validate_oid(oidStr: string): boolean {
  try {
    parse_oid(oidStr);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get the dotted OID string for a named algorithm.
 *
 * @param algorithm - Algorithm identifier (e.g., 'ml-kem-768')
 * @returns Dotted OID string
 * @throws {Error} Throws E_NOT_REGISTERED if algorithm is not in the registry
 */
export function get_oid_by_algorithm(algorithm: string): string {
  if (!(algorithm in algorithms)) {
    throw new Error(`E_NOT_REGISTERED: Algorithm '${algorithm}' is not registered`);
  }
  return algorithms[algorithm as Algorithm].oid_dotted;
}

/**
 * Check if an OID belongs to an SLH-DSA algorithm.
 *
 * @param oidStr - Dotted OID string to check
 * @returns true if the OID is an SLH-DSA OID, false otherwise (including unregistered OIDs)
 */
export function is_slh_dsa_oid(oidStr: string): boolean {
  try {
    const result = parse_oid(oidStr);
    return result.algorithm.startsWith('slh-dsa-');
  } catch (e) {
    return false;
  }
}

/**
 * List all registered OIDs with their algorithm identifiers.
 *
 * @returns Array of { algorithm, oid_dotted } for all 21 registered algorithms
 */
export function list_all_oids(): { algorithm: string; oid_dotted: string }[] {
  const result: { algorithm: string; oid_dotted: string }[] = [];
  for (const [algo, spec] of Object.entries(algorithms)) {
    result.push({ algorithm: algo, oid_dotted: spec.oid_dotted });
  }
  return result;
}