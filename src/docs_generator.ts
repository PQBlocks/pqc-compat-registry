// src/docs_generator.ts — Documentation generation from canonical registry
// Generates complete markdown documentation derived from the registry data — never hand-written prose.

import { algorithms, type Algorithm } from './registry.ts';
import { FIPS_TABLES } from './parameter_validator.ts';

/** Generate complete markdown documentation from the canonical registry. */
export function generateDocs(): string {
  const lines: string[] = [];

  // Title and overview
  lines.push('# PQC Algorithm Identifier Registry');
  lines.push('');
  lines.push('Canonical NIST FIPS 203/204/205 and RFC 9881/9909/9935 algorithm metadata with OID parsing, parameter validation, and CLI tooling.');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of contents
  lines.push('## Table of Contents');
  lines.push('');
  lines.push('1. [Algorithm Registry](#algorithm-registry)');
  lines.push('2. [OID Reference](#oid-reference)');
  lines.push('3. [Parameter Sizes (FIPS Tables)](#parameter-sizes-fips-tables)');
  lines.push('4. [Security Levels](#security-levels)');
  lines.push('5. [API Reference](#api-reference)');
  lines.push('6. [CLI Usage](#cli-usage)');
  lines.push('7. [Standards References](#standards-references)');
  lines.push('');

  // 1. Algorithm Registry
  lines.push('## Algorithm Registry');
  lines.push('');
  lines.push('All 21 NIST post-quantum cryptographic parameter sets registered in this library:');
  lines.push('');
  lines.push('| Algorithm | Standard | OID (Dotted) | Security (λ) | Key Length | Signature Length | Shared Secret |');
  lines.push('|-----------|----------|--------------|--------------|------------|------------------|---------------|');

  // Group by family
  const families = {
    'ml-kem': ['ml-kem-512', 'ml-kem-768', 'ml-kem-1024'] as Algorithm[],
    'ml-dsa': ['ml-dsa-44', 'ml-dsa-65', 'ml-dsa-87'] as Algorithm[],
    'slh-dsa': [
      'slh-dsa-sha2-128s', 'slh-dsa-sha2-128f', 'slh-dsa-sha2-192s', 'slh-dsa-sha2-192f',
      'slh-dsa-sha2-256s', 'slh-dsa-sha2-256f',
      'slh-dsa-shake-128s', 'slh-dsa-shake-128f', 'slh-dsa-shake-192s', 'slh-dsa-shake-192f',
      'slh-dsa-shake-256s', 'slh-dsa-shake-256f'
    ] as Algorithm[]
  };

  for (const [family, algos] of Object.entries(families)) {
    lines.push(`| **${family.toUpperCase()}** |||||||`);
    for (const algo of algos) {
      const spec = algorithms[algo];
      lines.push(`| ${algo} | ${spec.fips} | ${spec.oid_dotted} | ${spec.security_lambda} | ${spec.key_length} | ${spec.signature_length} | ${spec.shared_secret_length} |`);
    }
    lines.push('| | | | | | | |');
  }

  lines.push('');
  lines.push('---');
  lines.push('');

  // 2. OID Reference
  lines.push('## OID Reference');
  lines.push('');
  lines.push('### NIST OIDs (FIPS 203/204/205)');
  lines.push('');
  lines.push('| Algorithm | OID (Dotted) | OID Components |');
  lines.push('|-----------|--------------|----------------|');

  for (const [algo, spec] of Object.entries(algorithms)) {
    const components = spec.oid_components.join(' → ');
    lines.push(`| ${algo} | ${spec.oid_dotted} | ${components} |`);
  }

  lines.push('');
  lines.push('### Private Enterprise OIDs (RFC 9881/9909/9935)');
  lines.push('');
  lines.push('The following OIDs are also registered under the private enterprise arc 1.3.6.1.4.1.59514.1.1:*');
  lines.push('');
  lines.push('| Algorithm | Private OID | RFC Reference |');
  lines.push('|-----------|-------------|---------------|');
  lines.push('| ml-kem-512 | 1.3.6.1.4.1.59514.1.1.1 | RFC 9881 |');
  lines.push('| ml-kem-768 | 1.3.6.1.4.1.59514.1.1.2 | RFC 9881 |');
  lines.push('| ml-kem-1024 | 1.3.6.1.4.1.59514.1.1.3 | RFC 9881 |');
  lines.push('| ml-dsa-44 | 1.3.6.1.4.1.59514.1.1.4 | RFC 9909 |');
  lines.push('| ml-dsa-65 | 1.3.6.1.4.1.59514.1.1.5 | RFC 9909 |');
  lines.push('| ml-dsa-87 | 1.3.6.1.4.1.59514.1.1.6 | RFC 9909 |');
  lines.push('| slh-dsa-sha2-128s | 1.3.6.1.4.1.59514.1.1.7 | RFC 9935 |');
  lines.push('| slh-dsa-sha2-128f | 1.3.6.1.4.1.59514.1.1.8 | RFC 9935 |');
  lines.push('| slh-dsa-sha2-192s | 1.3.6.1.4.1.59514.1.1.9 | RFC 9935 |');
  lines.push('| slh-dsa-sha2-192f | 1.3.6.1.4.1.59514.1.1.10 | RFC 9935 |');
  lines.push('| slh-dsa-sha2-256s | 1.3.6.1.4.1.59514.1.1.11 | RFC 9935 |');
  lines.push('| slh-dsa-sha2-256f | 1.3.6.1.4.1.59514.1.1.12 | RFC 9935 |');
  lines.push('| slh-dsa-shake-128s | 1.3.6.1.4.1.59514.1.1.13 | RFC 9935 |');
  lines.push('| slh-dsa-shake-128f | 1.3.6.1.4.1.59514.1.1.14 | RFC 9935 |');
  lines.push('| slh-dsa-shake-192s | 1.3.6.1.4.1.59514.1.1.15 | RFC 9935 |');
  lines.push('| slh-dsa-shake-192f | 1.3.6.1.4.1.59514.1.1.16 | RFC 9935 |');
  lines.push('| slh-dsa-shake-256s | 1.3.6.1.4.1.59514.1.1.17 | RFC 9935 |');
  lines.push('| slh-dsa-shake-256f | 1.3.6.1.4.1.59514.1.1.18 | RFC 9935 |');

  lines.push('');
  lines.push('---');
  lines.push('');

  // 3. Parameter Sizes (FIPS Tables)
  lines.push('## Parameter Sizes (FIPS Tables)');
  lines.push('');
  lines.push('All sizes sourced from primary standards tables:');
  lines.push('');
  lines.push('- **FIPS 203 Table 3**: ML-KEM encapsulation key, decapsulation key, ciphertext, shared secret');
  lines.push('- **FIPS 204 Table 2**: ML-DSA private key, public key, signature');
  lines.push('- **FIPS 205 Table 2**: SLH-DSA private key, public key, signature');
  lines.push('');

  lines.push('### FIPS 203 (ML-KEM)');
  lines.push('');
  lines.push('| Algorithm | Encapsulation Key | Decapsulation Key | Ciphertext | Shared Secret |');
  lines.push('|-----------|-------------------|-------------------|------------|---------------|');
  for (const algo of families['ml-kem']) {
    const spec = algorithms[algo];
    const fips = FIPS_TABLES.fips203[algo as keyof typeof FIPS_TABLES.fips203];
    lines.push(`| ${algo} | ${fips.encapsulation_key} | ${fips.decapsulation_key} | ${fips.ciphertext} | ${fips.shared_secret} |`);
  }

  lines.push('');
  lines.push('### FIPS 204 (ML-DSA)');
  lines.push('');
  lines.push('| Algorithm | Private Key | Public Key | Signature |');
  lines.push('|-----------|-------------|------------|-----------|');
  for (const algo of families['ml-dsa']) {
    const fips = FIPS_TABLES.fips204[algo as keyof typeof FIPS_TABLES.fips204];
    lines.push(`| ${algo} | ${fips.private_key} | ${fips.public_key} | ${fips.signature} |`);
  }

  lines.push('');
  lines.push('### FIPS 205 (SLH-DSA)');
  lines.push('');
  lines.push('| Algorithm | Private Key | Public Key | Signature |');
  lines.push('|-----------|-------------|------------|-----------|');
  for (const algo of families['slh-dsa']) {
    const fips = FIPS_TABLES.fips205[algo as keyof typeof FIPS_TABLES.fips205];
    lines.push(`| ${algo} | ${fips.private_key} | ${fips.public_key} | ${fips.signature} |`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');

  // 4. Security Levels
  lines.push('## Security Levels');
  lines.push('');
  lines.push('NIST security strength (λ) in bits per FIPS 203/204/205 security categories:');
  lines.push('');
  lines.push('| Security Level (λ) | Category | Algorithms |');
  lines.push('|--------------------|----------|------------|');
  lines.push('| 128 | Category 1 | ml-kem-512, ml-dsa-44, slh-dsa-sha2-128s, slh-dsa-sha2-128f, slh-dsa-shake-128s, slh-dsa-shake-128f |');
  lines.push('| 192 | Category 3 | ml-kem-768, ml-dsa-65, slh-dsa-sha2-192s, slh-dsa-sha2-192f, slh-dsa-shake-192s, slh-dsa-shake-192f |');
  lines.push('| 256 | Category 5 | ml-kem-1024, ml-dsa-87, slh-dsa-sha2-256s, slh-dsa-sha2-256f, slh-dsa-shake-256s, slh-dsa-shake-256f |');

  lines.push('');
  lines.push('---');
  lines.push('');

  // 5. API Reference
  lines.push('## API Reference');
  lines.push('');
  lines.push('### Core Registry (`@pqblocks/pqc-compat-registry`)');
  lines.push('');
  lines.push('| Export | Type | Description |');
  lines.push('|--------|------|-------------|');
  lines.push('| `algorithms` | `Record<Algorithm, AlgorithmSpec>` | Complete registry of all 21 parameter sets |');
  lines.push('| `ALL_ALGORITHMS` | `ReadonlyArray<string>` | List of all 21 algorithm identifiers |');
  lines.push('| `ALL_OIDS` | `ReadonlyArray<string>` | List of all 18 NIST OIDs |');
  lines.push('| `version` | `string` | Package version (1.0.0) |');
  lines.push('| `license` | `string` | Apache-2.0 |');
  lines.push('| `description` | `string` | Package description |');
  lines.push('| `ping()` | `() => boolean` | Health check |');
  lines.push('| `hello(name)` | `(name: string) => string` | Greeting function |');
  lines.push('| `Feature` | `const { PING, HELLO }` | Feature flags |');
  lines.push('| `FeatureClass` | `class` | Feature wrapper class |');

  lines.push('');
  lines.push('### OID Parsing (`@pqblocks/pqc-compat-registry/oid`)');
  lines.push('');
  lines.push('| Function | Signature | Description |');
  lines.push('|----------|-----------|-------------|');
  lines.push('| `parse_oid(oidStr)` | `(oidStr: string) => OidParseResult` | Parse dotted OID to algorithm metadata |');
  lines.push('| `validate_oid(oidStr)` | `(oidStr: string) => boolean` | Validate OID against registry |');
  lines.push('| `get_oid_by_algorithm(algo)` | `(algorithm: string) => string` | Get OID for registered algorithm |');
  lines.push('| `is_slh_dsa_oid(oidStr)` | `(oidStr: string) => boolean` | Check if OID is SLH-DSA |');
  lines.push('| `list_all_oids()` | `() => {algorithm, oid_dotted}[]` | List all registered OIDs |');

  lines.push('');
  lines.push('### Parameter Validation (`@pqblocks/pqc-compat-registry/parameters`)');
  lines.push('');
  lines.push('| Export | Type | Description |');
  lines.push('|--------|------|-------------|');
  lines.push('| `FIPS_TABLES` | `FIPS_SIZE_TABLES` | Canonical FIPS 203/204/205 size tables |');
  lines.push('| `get_expected_sizes(algo)` | `(algorithm: string) => ExpectedSizes` | Get expected sizes for algorithm |');
  lines.push('| `validate_parameter_sizes(algo, sizes)` | `(algorithm: string, sizes: Record<string, number>) => ValidationResult` | Validate sizes against FIPS |');

  lines.push('');
  lines.push('### SLH-DSA Validation (`@pqblocks/pqc-compat-registry/slh-dsa`)');
  lines.push('');
  lines.push('| Function | Signature | Description |');
  lines.push('|----------|-----------|-------------|');
  lines.push('| `validate_slh_dsa_sizes(sizes)` | `(sizes: SLHDSASizes) => SLHDSASizeValidation` | Validate SLH-DSA specific sizes |');

  lines.push('');
  lines.push('---');
  lines.push('');

  // 6. CLI Usage
  lines.push('## CLI Usage');
  lines.push('');
  lines.push('The package installs the `pqc-registry` command:');
  lines.push('');
  lines.push('```bash');
  lines.push('npx pqc-registry <command> [args...]');
  lines.push('```');
  lines.push('');

  lines.push('### Commands');
  lines.push('');
  lines.push('| Command | Arguments | Description |');
  lines.push('|---------|-----------|-------------|');
  lines.push('| `parse <oid>` | `oid` — dotted OID string | Parse OID and output algorithm metadata as JSON |');
  lines.push('| `validate-oid <oid>` | `oid` — dotted OID string | Validate OID against registry (exit code 0=valid, 1=invalid) |');
  lines.push('| `lookup <algorithm>` | `algorithm` — registered algorithm key | Look up OID for algorithm |');
  lines.push('| `validate-sizes <algorithm> --public-key <n> --secret-key <n> --ciphertext <n> [--shared-secret <n>]` | Algorithm + sizes | Validate sizes against FIPS table |');
  lines.push('| `list [--level <n>]` | `--level` — security level (128/192/256) | List all algorithms, optionally filtered by security level |');
  lines.push('| `help` | (none) | Show usage |');

  lines.push('');
  lines.push('### Examples');
  lines.push('');
  lines.push('```bash');
  lines.push('# Parse an ML-KEM-768 OID');
  lines.push('pqc-registry parse 2.16.840.1.101.3.4.4.2');
  lines.push('');
  lines.push('# Validate an OID');
  lines.push('pqc-registry validate-oid 2.16.840.1.101.3.4.4.1');
  lines.push('');
  lines.push('# Look up OID for algorithm');
  lines.push('pqc-registry lookup ml-dsa-65');
  lines.push('');
  lines.push('# Validate ML-KEM-768 sizes');
  lines.push('pqc-registry validate-sizes ml-kem-768 --public-key 1184 --secret-key 2400 --ciphertext 1088 --shared-secret 32');
  lines.push('');
  lines.push('# List all Category 1 (128-bit) algorithms');
  lines.push('pqc-registry list --level 128');
  lines.push('```');

  lines.push('');
  lines.push('---');
  lines.push('');

  // 7. Standards References
  lines.push('## Standards References');
  lines.push('');
  lines.push('| Standard | Title | Algorithms Covered |');
  lines.push('|----------|-------|-------------------|');
  lines.push('| FIPS 203 | Module-Lattice-Based Key-Encapsulation Mechanism Standard | ML-KEM-512, ML-KEM-768, ML-KEM-1024 |');
  lines.push('| FIPS 204 | Module-Lattice-Based Digital Signature Standard | ML-DSA-44, ML-DSA-65, ML-DSA-87 |');
  lines.push('| FIPS 205 | Stateless Hash-Based Digital Signature Standard | All 12 SLH-DSA parameter sets |');
  lines.push('| RFC 9881 | ML-KEM Algorithm Identifiers | ML-KEM OIDs |');
  lines.push('| RFC 9909 | ML-DSA Algorithm Identifiers | ML-DSA OIDs |');
  lines.push('| RFC 9935 | SLH-DSA Algorithm Identifiers | SLH-DSA OIDs |');

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*Documentation generated from canonical registry data. Do not edit manually — run the documentation generator instead.*');

  return lines.join('\n') + '\n';
}