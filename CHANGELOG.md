# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-07

### Added

- OID validation and parsing for NIST post-quantum algorithm identifiers (`validate_oid`, `parse_oid`).
- Algorithm lookup by OID (`get_algorithm_by_oid`) and OID lookup by algorithm name (`get_oid_by_algorithm`).
- Registry of 26 algorithms: 6 ML-KEM (FIPS 203), 8 ML-DSA (FIPS 204), 12 SLH-DSA (FIPS 205).
- Parameter-size validators for ML-KEM, ML-DSA, and SLH-DSA (`validate_parameter_sizes`, `validate_slh_dsa_sizes`) cross-checked against FIPS 203 Table 3, FIPS 204 Table 2, and FIPS 205 Table 2.
- NIST-arc OIDs (`2.16.840.1.101.3.4.x`) from FIPS 203/204/205 and RFC 9881/9882/9935, carried in the registry and parsed by the main lookup path.
- Golden vector fixtures for ML-KEM, ML-DSA, and SLH-DSA (18 vectors in total) used by the test suite.
- Command-line interface for listing registered algorithms with their OIDs and size metadata.
- Zero runtime dependencies; TypeScript source with type stubs published for typed consumers.

### Fixed

- `validate_parameter_sizes` and `validate_slh_dsa_sizes` now agree on FIPS-correct SLH-DSA inputs.
- `registry.key_length` for all 12 SLH-DSA entries now matches FIPS 205 Table 2 (64/96/128 bytes).
- `get_oid_by_algorithm` throws `E_NOT_REGISTERED` for prototype-pollution keys instead of returning `undefined`.
- Duplicate entries removed from `ALL_ALGORITHMS`; single source of truth with RFC annotation.
- Explicit per-field accessors (`public_key_length`, `private_key_length`, `encapsulation_key_length`, `decapsulation_key_length`, `signature_length`) added to resolve `key_length` ambiguity.

### Security

- This package performs no cryptographic operations. It is metadata only and is not FIPS 140-3 / CMVP
  validated.
- All inputs are validated; malformed inputs produce typed errors or `false` from `validate_oid`.
