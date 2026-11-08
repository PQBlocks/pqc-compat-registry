// types/index.ts — TypeScript type definitions for the PQC registry API
// Canonical type definitions for @pqblocks/pqc-compat-registry
// All types are structural and erased at compile time; no runtime behavior.

export type AlgorithmType = 'ml-kem' | 'ml-dsa' | 'slh-dsa';

export type SecurityLevel = 128 | 192 | 256;

export interface AlgorithmSpec {
  /** The dotted OID (RFC 9881, 9909, 9935) */
  oid: string;
  /** Algorithm display name (e.g., ML-KEM-768) */
  name: string;
  /** Algorithm category for parameter sizing */
  type: AlgorithmType;
  /** Security level in bits */
  level: SecurityLevel;
  /** Public key, secret key, ciphertext sizes per FIPS tables */
  sizes: {
    publicKeyBytes: number;
    secretKeyBytes: number;
    ciphertextBytes: number;
  };
  /** FIPS / RFC specification references */
  refs: {
    fips?: string;
    rfc?: string;
  };
  /** ASN.1 component names from OID arc 59514.1.X */
  asn1: string[];
}

export interface OIDResult {
  success: boolean;
  algorithm?: AlgorithmType;
  name?: string;
  oid?: string;
  details?: string;
  error?: string;
}

export interface ExpectedSizes {
  [K: string]: {
    publicKeyBytes: number;
    secretKeyBytes: number;
    ciphertextBytes: number;
  };
}

export interface SizeValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface ValidationConfig {
  strict: boolean;
  allowedAlgorithms?: AlgorithmType[];
}

export interface AlgorithmMetrics {
  parsingTimeMs: number;
  validationTimeMs: number;
}

export type FeatureFlag = 'oid-parsing' | 'param-validation' | 'slh-dsa-support' | 'cli-access';

export interface PackageMeta {
  name: string;
  version: string;
  license: string;
  description: string;
  type?: string;
}

export type AnyAsyncResult = Promise<unknown>;

export interface CLICommands {
  parse: (oid: string) => void;
  validate: (oid: string) => void;
  lookup: (algorithm: string) => void;
  validateSizes: (algorithm: string, sizes: { publicKeyBytes: number; secretKeyBytes: number; ciphertextBytes: number }) => void;
}

export type LanguageFeature = 'es2022' | 'modules' | 'async-await' | 'generators' | 'decorators';

export type BuildOutput = 'success' | 'warning' | 'error';

export interface BuildResult {
  success: boolean;
  output: BuildOutput;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
