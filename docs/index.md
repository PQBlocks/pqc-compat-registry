# PQC Algorithm Identifier Registry

Canonical NIST FIPS 203/204/205 and RFC 9881/9909/9935 algorithm metadata with OID parsing, parameter validation, and CLI tooling.

---

## Table of Contents

1. [Algorithm Registry](#algorithm-registry)
2. [OID Reference](#oid-reference)
3. [Parameter Sizes (FIPS Tables)](#parameter-sizes-fips-tables)
4. [Security Levels](#security-levels)
5. [API Reference](#api-reference)
6. [CLI Usage](#cli-usage)
7. [Standards References](#standards-references)

## Algorithm Registry

All 21 NIST post-quantum cryptographic parameter sets registered in this library:

| Algorithm | Standard | OID (Dotted) | Security (λ) | Key Length | Signature Length | Shared Secret |
|-----------|----------|--------------|--------------|------------|------------------|---------------|
| **ML-KEM** |||||||
| ml-kem-512 | FIPS 203 | 2.16.840.1.101.3.4.4.1 | 128 | 800 | 1632 | 32 |
| ml-kem-768 | FIPS 203 | 2.16.840.1.101.3.4.4.2 | 192 | 1184 | 2400 | 32 |
| ml-kem-1024 | FIPS 203 | 2.16.840.1.101.3.4.4.3 | 256 | 1568 | 3168 | 32 |
| | | | | | | |
| **ML-DSA** |||||||
| ml-dsa-44 | FIPS 204 | 2.16.840.1.101.3.4.3.17 | 128 | 2560 | 2420 | 32 |
| ml-dsa-65 | FIPS 204 | 2.16.840.1.101.3.4.3.18 | 192 | 4032 | 3309 | 32 |
| ml-dsa-87 | FIPS 204 | 2.16.840.1.101.3.4.3.19 | 256 | 4896 | 4627 | 32 |
| | | | | | | |
| **SLH-DSA** |||||||
| slh-dsa-sha2-128s | FIPS 205 | 2.16.840.1.101.3.4.3.20 | 128 | 64 | 7856 | 32 |
| slh-dsa-sha2-128f | FIPS 205 | 2.16.840.1.101.3.4.3.21 | 128 | 64 | 17088 | 32 |
| slh-dsa-sha2-192s | FIPS 205 | 2.16.840.1.101.3.4.3.22 | 192 | 96 | 16224 | 32 |
| slh-dsa-sha2-192f | FIPS 205 | 2.16.840.1.101.3.4.3.23 | 192 | 96 | 35664 | 32 |
| slh-dsa-sha2-256s | FIPS 205 | 2.16.840.1.101.3.4.3.24 | 256 | 128 | 29792 | 32 |
| slh-dsa-sha2-256f | FIPS 205 | 2.16.840.1.101.3.4.3.25 | 256 | 128 | 49856 | 32 |
| slh-dsa-shake-128s | FIPS 205 | 2.16.840.1.101.3.4.3.26 | 128 | 64 | 7856 | 32 |
| slh-dsa-shake-128f | FIPS 205 | 2.16.840.1.101.3.4.3.27 | 128 | 64 | 17088 | 32 |
| slh-dsa-shake-192s | FIPS 205 | 2.16.840.1.101.3.4.3.28 | 192 | 96 | 16224 | 32 |
| slh-dsa-shake-192f | FIPS 205 | 2.16.840.1.101.3.4.3.29 | 192 | 96 | 35664 | 32 |
| slh-dsa-shake-256s | FIPS 205 | 2.16.840.1.101.3.4.3.30 | 256 | 128 | 29792 | 32 |
| slh-dsa-shake-256f | FIPS 205 | 2.16.840.1.101.3.4.3.31 | 256 | 128 | 49856 | 32 |
| | | | | | | |

---

## OID Reference

### NIST OIDs (FIPS 203/204/205)

| Algorithm | OID (Dotted) | OID Components |
|-----------|--------------|----------------|
| ml-kem-512 | 2.16.840.1.101.3.4.4.1 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → kems → id-alg-ml-kem-512 → 1 |
| ml-kem-768 | 2.16.840.1.101.3.4.4.2 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → kems → id-alg-ml-kem-768 → 2 |
| ml-kem-1024 | 2.16.840.1.101.3.4.4.3 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → kems → id-alg-ml-kem-1024 → 3 |
| ml-dsa-44 | 2.16.840.1.101.3.4.3.17 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-ml-dsa-44 → 17 |
| ml-dsa-65 | 2.16.840.1.101.3.4.3.18 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-ml-dsa-65 → 18 |
| ml-dsa-87 | 2.16.840.1.101.3.4.3.19 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-ml-dsa-87 → 19 |
| slh-dsa-sha2-128s | 2.16.840.1.101.3.4.3.20 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-sha2-128s → 20 |
| slh-dsa-sha2-128f | 2.16.840.1.101.3.4.3.21 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-sha2-128f → 21 |
| slh-dsa-sha2-192s | 2.16.840.1.101.3.4.3.22 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-sha2-192s → 22 |
| slh-dsa-sha2-192f | 2.16.840.1.101.3.4.3.23 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-sha2-192f → 23 |
| slh-dsa-sha2-256s | 2.16.840.1.101.3.4.3.24 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-sha2-256s → 24 |
| slh-dsa-sha2-256f | 2.16.840.1.101.3.4.3.25 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-sha2-256f → 25 |
| slh-dsa-shake-128s | 2.16.840.1.101.3.4.3.26 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-shake-128s → 26 |
| slh-dsa-shake-128f | 2.16.840.1.101.3.4.3.27 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-shake-128f → 27 |
| slh-dsa-shake-192s | 2.16.840.1.101.3.4.3.28 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-shake-192s → 28 |
| slh-dsa-shake-192f | 2.16.840.1.101.3.4.3.29 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-shake-192f → 29 |
| slh-dsa-shake-256s | 2.16.840.1.101.3.4.3.30 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-shake-256s → 30 |
| slh-dsa-shake-256f | 2.16.840.1.101.3.4.3.31 | joint-iso-itu-t → country → us → organization → gov → csor → nistAlgorithm → sigAlgs → id-slh-dsa-shake-256f → 31 |

### Private Enterprise OIDs (RFC 9881/9909/9935)

The following OIDs are also registered under the private enterprise arc 1.3.6.1.4.1.59514.1.1:*

| Algorithm | Private OID | RFC Reference |
|-----------|-------------|---------------|
| ml-kem-512 | 1.3.6.1.4.1.59514.1.1.1 | RFC 9881 |
| ml-kem-768 | 1.3.6.1.4.1.59514.1.1.2 | RFC 9881 |
| ml-kem-1024 | 1.3.6.1.4.1.59514.1.1.3 | RFC 9881 |
| ml-dsa-44 | 1.3.6.1.4.1.59514.1.1.4 | RFC 9909 |
| ml-dsa-65 | 1.3.6.1.4.1.59514.1.1.5 | RFC 9909 |
| ml-dsa-87 | 1.3.6.1.4.1.59514.1.1.6 | RFC 9909 |
| slh-dsa-sha2-128s | 1.3.6.1.4.1.59514.1.1.7 | RFC 9935 |
| slh-dsa-sha2-128f | 1.3.6.1.4.1.59514.1.1.8 | RFC 9935 |
| slh-dsa-sha2-192s | 1.3.6.1.4.1.59514.1.1.9 | RFC 9935 |
| slh-dsa-sha2-192f | 1.3.6.1.4.1.59514.1.1.10 | RFC 9935 |
| slh-dsa-sha2-256s | 1.3.6.1.4.1.59514.1.1.11 | RFC 9935 |
| slh-dsa-sha2-256f | 1.3.6.1.4.1.59514.1.1.12 | RFC 9935 |
| slh-dsa-shake-128s | 1.3.6.1.4.1.59514.1.1.13 | RFC 9935 |
| slh-dsa-shake-128f | 1.3.6.1.4.1.59514.1.1.14 | RFC 9935 |
| slh-dsa-shake-192s | 1.3.6.1.4.1.59514.1.1.15 | RFC 9935 |
| slh-dsa-shake-192f | 1.3.6.1.4.1.59514.1.1.16 | RFC 9935 |
| slh-dsa-shake-256s | 1.3.6.1.4.1.59514.1.1.17 | RFC 9935 |
| slh-dsa-shake-256f | 1.3.6.1.4.1.59514.1.1.18 | RFC 9935 |

---

## Parameter Sizes (FIPS Tables)

All sizes sourced from primary standards tables:

- **FIPS 203 Table 3**: ML-KEM encapsulation key, decapsulation key, ciphertext, shared secret
- **FIPS 204 Table 2**: ML-DSA private key, public key, signature
- **FIPS 205 Table 2**: SLH-DSA private key, public key, signature

### FIPS 203 (ML-KEM)

| Algorithm | Encapsulation Key | Decapsulation Key | Ciphertext | Shared Secret |
|-----------|-------------------|-------------------|------------|---------------|
| ml-kem-512 | 800 | 1632 | 768 | 32 |
| ml-kem-768 | 1184 | 2400 | 1088 | 32 |
| ml-kem-1024 | 1568 | 3168 | 1568 | 32 |

### FIPS 204 (ML-DSA)

| Algorithm | Private Key | Public Key | Signature |
|-----------|-------------|------------|-----------|
| ml-dsa-44 | 2560 | 1312 | 2420 |
| ml-dsa-65 | 4032 | 1952 | 3309 |
| ml-dsa-87 | 4896 | 2592 | 4627 |

### FIPS 205 (SLH-DSA)

| Algorithm | Private Key | Public Key | Signature |
|-----------|-------------|------------|-----------|
| slh-dsa-sha2-128s | 64 | 32 | 7856 |
| slh-dsa-sha2-128f | 64 | 32 | 17088 |
| slh-dsa-sha2-192s | 96 | 48 | 16224 |
| slh-dsa-sha2-192f | 96 | 48 | 35664 |
| slh-dsa-sha2-256s | 128 | 64 | 29792 |
| slh-dsa-sha2-256f | 128 | 64 | 49856 |
| slh-dsa-shake-128s | 64 | 32 | 7856 |
| slh-dsa-shake-128f | 64 | 32 | 17088 |
| slh-dsa-shake-192s | 96 | 48 | 16224 |
| slh-dsa-shake-192f | 96 | 48 | 35664 |
| slh-dsa-shake-256s | 128 | 64 | 29792 |
| slh-dsa-shake-256f | 128 | 64 | 49856 |

---

## Security Levels

NIST security strength (λ) in bits per FIPS 203/204/205 security categories:

| Security Level (λ) | Category | Algorithms |
|--------------------|----------|------------|
| 128 | Category 1 | ml-kem-512, ml-dsa-44, slh-dsa-sha2-128s, slh-dsa-sha2-128f, slh-dsa-shake-128s, slh-dsa-shake-128f |
| 192 | Category 3 | ml-kem-768, ml-dsa-65, slh-dsa-sha2-192s, slh-dsa-sha2-192f, slh-dsa-shake-192s, slh-dsa-shake-192f |
| 256 | Category 5 | ml-kem-1024, ml-dsa-87, slh-dsa-sha2-256s, slh-dsa-sha2-256f, slh-dsa-shake-256s, slh-dsa-shake-256f |

---

## API Reference

### Core Registry (`@pqblocks/pqc-compat-registry`)

| Export | Type | Description |
|--------|------|-------------|
| `algorithms` | `Record<Algorithm, AlgorithmSpec>` | Complete registry of all 21 parameter sets |
| `ALL_ALGORITHMS` | `ReadonlyArray<string>` | List of all 21 algorithm identifiers |
| `ALL_OIDS` | `ReadonlyArray<string>` | List of all 18 NIST OIDs |
| `version` | `string` | Package version (1.0.0) |
| `license` | `string` | Apache-2.0 |
| `description` | `string` | Package description |
| `ping()` | `() => boolean` | Health check |
| `hello(name)` | `(name: string) => string` | Greeting function |
| `Feature` | `const { PING, HELLO }` | Feature flags |
| `FeatureClass` | `class` | Feature wrapper class |

### OID Parsing (`@pqblocks/pqc-compat-registry/oid`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `parse_oid(oidStr)` | `(oidStr: string) => OidParseResult` | Parse dotted OID to algorithm metadata |
| `validate_oid(oidStr)` | `(oidStr: string) => boolean` | Validate OID against registry |
| `get_oid_by_algorithm(algo)` | `(algorithm: string) => string` | Get OID for registered algorithm |
| `is_slh_dsa_oid(oidStr)` | `(oidStr: string) => boolean` | Check if OID is SLH-DSA |
| `list_all_oids()` | `() => {algorithm, oid_dotted}[]` | List all registered OIDs |

### Parameter Validation (`@pqblocks/pqc-compat-registry/parameters`)

| Export | Type | Description |
|--------|------|-------------|
| `FIPS_TABLES` | `FIPS_SIZE_TABLES` | Canonical FIPS 203/204/205 size tables |
| `get_expected_sizes(algo)` | `(algorithm: string) => ExpectedSizes` | Get expected sizes for algorithm |
| `validate_parameter_sizes(algo, sizes)` | `(algorithm: string, sizes: Record<string, number>) => ValidationResult` | Validate sizes against FIPS |

### SLH-DSA Validation (`@pqblocks/pqc-compat-registry/slh-dsa`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `validate_slh_dsa_sizes(sizes)` | `(sizes: SLHDSASizes) => SLHDSASizeValidation` | Validate SLH-DSA specific sizes |

---

## CLI Usage

The package installs the `pqc-registry` command:

```bash
npx pqc-registry <command> [args...]
```

### Commands

| Command | Arguments | Description |
|---------|-----------|-------------|
| `parse <oid>` | `oid` — dotted OID string | Parse OID and output algorithm metadata as JSON |
| `validate-oid <oid>` | `oid` — dotted OID string | Validate OID against registry (exit code 0=valid, 1=invalid) |
| `lookup <algorithm>` | `algorithm` — registered algorithm key | Look up OID for algorithm |
| `validate-sizes <algorithm> --public-key <n> --secret-key <n> --ciphertext <n> [--shared-secret <n>]` | Algorithm + sizes | Validate sizes against FIPS table |
| `list [--level <n>]` | `--level` — security level (128/192/256) | List all algorithms, optionally filtered by security level |
| `help` | (none) | Show usage |

### Examples

```bash
# Parse an ML-KEM-768 OID
pqc-registry parse 2.16.840.1.101.3.4.4.2

# Validate an OID
pqc-registry validate-oid 2.16.840.1.101.3.4.4.1

# Look up OID for algorithm
pqc-registry lookup ml-dsa-65

# Validate ML-KEM-768 sizes
pqc-registry validate-sizes ml-kem-768 --public-key 1184 --secret-key 2400 --ciphertext 1088 --shared-secret 32

# List all Category 1 (128-bit) algorithms
pqc-registry list --level 128
```

---

## Standards References

| Standard | Title | Algorithms Covered |
|----------|-------|-------------------|
| FIPS 203 | Module-Lattice-Based Key-Encapsulation Mechanism Standard | ML-KEM-512, ML-KEM-768, ML-KEM-1024 |
| FIPS 204 | Module-Lattice-Based Digital Signature Standard | ML-DSA-44, ML-DSA-65, ML-DSA-87 |
| FIPS 205 | Stateless Hash-Based Digital Signature Standard | All 12 SLH-DSA parameter sets |
| RFC 9881 | ML-KEM Algorithm Identifiers | ML-KEM OIDs |
| RFC 9909 | ML-DSA Algorithm Identifiers | ML-DSA OIDs |
| RFC 9935 | SLH-DSA Algorithm Identifiers | SLH-DSA OIDs |

---

*Documentation generated from canonical registry data. Do not edit manually — run the documentation generator instead.*
