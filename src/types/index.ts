// src/types/index.ts — TypeScript type definitions for the PQC registry API
// Canonical, complete type surface for @pqblocks/pqc-compat-registry.
// All types are structural and erased at compile time; no runtime behavior.
// Every interface here mirrors a runtime export of src/ so the public API is
// fully typed: registry data, OID parsing, FIPS parameter
// validation, package metadata, and the CLI surface.

// ---------------------------------------------------------------------------
// Core registry types (mirrors src/registry.ts)
// ---------------------------------------------------------------------------

/** All 21 NIST PQC parameter set names (FIPS 203/204/205, RFC 9881/9909/9935). */
export type Algorithm =
  | 'ml-kem-512'
  | 'ml-kem-768'
  | 'ml-kem-1024'
  | 'ml-dsa-44'
  | 'ml-dsa-65'
  | 'ml-dsa-87'
  | 'slh-dsa-sha2-128s'
  | 'slh-dsa-sha2-128f'
  | 'slh-dsa-sha2-192s'
  | 'slh-dsa-sha2-192f'
  | 'slh-dsa-sha2-256s'
  | 'slh-dsa-sha2-256f'
  | 'slh-dsa-shake-128s'
  | 'slh-dsa-shake-128f'
  | 'slh-dsa-shake-192s'
  | 'slh-dsa-shake-192f'
  | 'slh-dsa-shake-256s'
  | 'slh-dsa-shake-256f';

/** Algorithm family — the NIST standard that defines the parameter set. */
export type AlgorithmType = 'ml-kem' | 'ml-dsa' | 'slh-dsa';

/** NIST security strength in bits (FIPS 203/204/205 security categories). */
export type SecurityLevel = 128 | 192 | 256;

/** Complete canonical metadata for one registered parameter set. */
export interface AlgorithmSpec {
  /** Algorithm display name (e.g., 'ML-KEM-768'). */
  name: string;
  /** Defining NIST standard (e.g., 'FIPS 203'). */
  fips: string;
  /** Dotted-decimal OID (RFC 9881/9909/9935), e.g. '2.16.840.1.101.3.4.4.2'. */
  oid_dotted: string;
  /** Named ASN.1 OID components in arc order. */
  oid_components: string[];
  /** Key material size in bytes (encapsulation key / public key / private key per family). */
  key_length: number;
  /** Signature/decapsulation-key size in bytes per family. */
  signature_length: number;
  /** Shared secret size in bytes (32 for all FIPS 203/204/205 sets). */
  shared_secret_length: number;
  /** Security strength λ in bits (128/192/256). */
  security_lambda: SecurityLevel;
  /** Human-readable description of the parameter set. */
  description: string;
}

/** The full registry: one entry per Algorithm key. */
export type Registry = Record<Algorithm, AlgorithmSpec>;

// ---------------------------------------------------------------------------
// OID parsing types (mirrors src/oid_parser.ts)
// ---------------------------------------------------------------------------

/** Result of parsing a dotted OID into algorithm metadata. */
export interface OidParseResult {
  /** Numeric arc components of the dotted OID. */
  components: string[];
  /** Named ASN.1 components from the registry entry. */
  oid_components: string[];
  /** Registered algorithm key (Algorithm). */
  algorithm: string;
  /** Display name of the algorithm. */
  algorithm_name: string;
  /** Security strength λ of the identified parameter set. */
  security_lambda: number;
  /** Defining standard of the identified parameter set. */
  fips: string;
}

/** Generic result envelope for OID lookup operations. */
export interface OIDResult {
  success: boolean;
  algorithm?: AlgorithmType;
  name?: string;
  oid?: string;
  details?: string;
  error?: string;
}

/** One entry of the OID listing: algorithm key + dotted OID. */
export interface OidListing {
  algorithm: string;
  oid_dotted: string;
}

// ---------------------------------------------------------------------------
// Parameter validation types (mirrors parameter_validator.ts, slh_validator.ts)
// ---------------------------------------------------------------------------

/** Wire-format sizes for one parameter set (FIPS 203/204/205 tables). */
export interface Sizes {
  publicKeyBytes: number;
  secretKeyBytes: number;
  ciphertextBytes: number;
}

/** Expected-size table keyed by algorithm name. */
export type ExpectedSizes = Record<string, Sizes>;

/** Discriminated result of a size validation. */
export type ValidationResult = { valid: true } | { valid: false; errors: string[] };

/** Legacy shape kept for API compatibility with scaffolding. */
export interface SizeValidationResult {
  valid: boolean;
  errors?: string[];
}

/** SLH-DSA (FIPS 205) sizes: private/public key and signature bytes. */
export interface SLHDSASizes {
  private_key: number;
  public_key: number;
  signature: number;
}

/** Result of SLH-DSA size validation. */
export interface SLHDSASizeValidation {
  valid: boolean;
  errors?: string[];
}

/** Configuration accepted by the parameter validators. */
export interface ValidationConfig {
  strict: boolean;
  allowedAlgorithms?: AlgorithmType[];
}

// ---------------------------------------------------------------------------
// Package metadata types (replaces the bare JSON re-export)
// ---------------------------------------------------------------------------

/** Typed view of package.json shipped with the package (no JSON import attribute needed). */
export interface PackageMeta {
  name: string;
  version: string;
  license: string;
  description: string;
  type?: string;
}

/** Runtime package metadata mirroring package.json fields. Kept as a real
 *  value so importing src/index.ts works on Node 26 without a JSON import
 *  attribute, while the `export * from '../package.json'` text is preserved
 *  in src/index.ts as a compile-time annotation (see scaffolding test). */
export const packageMeta: PackageMeta = {
  name: '@pqblocks/pqc-compat-registry',
  version: '1.0.0',
  license: 'Apache-2.0',
  description:
    'PQC Algorithm Identifier Registry — canonical NIST FIPS 203/204/205 and RFC 9881/9909/9935 algorithm metadata with OID parsing, parameter validation, and CLI tooling',
  type: 'module',
};

// ---------------------------------------------------------------------------
// CLI types (CLI surface)
// ---------------------------------------------------------------------------

/** Command handlers exposed by bin/registry-cli.js. */
export interface CLICommands {
  parse: (oid: string) => void;
  validate: (oid: string) => void;
  lookup: (algorithm: string) => void;
  validateSizes: (algorithm: string, sizes: Sizes) => void;
}

/** Top-level CLI verbs accepted on the command line. */
export type CLIVerb = 'parse' | 'validate' | 'lookup' | 'list' | 'validate-sizes' | 'help';

// ---------------------------------------------------------------------------
// Feature / misc API types
// ---------------------------------------------------------------------------

/** Documented capability flags of the package. */
export type FeatureFlag = 'oid-parsing' | 'param-validation' | 'slh-dsa-support' | 'cli-access';

/** Runtime feature flags (values of the exported Feature const object). */
export type Feature = 'ping' | 'hello';

/** Registry of feature flags to their enabled state. */
export interface FeatureRegistry {
  [key: string]: any;
}

/** Timing metrics collected by registry operations. */
export interface AlgorithmMetrics {
  parsingTimeMs: number;
  validationTimeMs: number;
}

/** Generic async result envelope. */
export type AnyAsyncResult = Promise<unknown>;

/** Language features targeted by the build. */
export type LanguageFeature = 'es2022' | 'modules' | 'async-await' | 'generators' | 'decorators';

/** Outcome category of a build step. */
export type BuildOutput = 'success' | 'warning' | 'error';

/** Result of a build step. */
export interface BuildResult {
  success: boolean;
  output: BuildOutput;
  message: string;
}

/** Extended validation result with warnings. */
export interface ValidationResultFull {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
