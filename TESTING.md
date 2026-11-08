# TESTING.md

## Test execution summary

| Metric | Value |
|---|---|
| Total tests | 128 |
| Passed | 128 |
| Failed | 0 |
| Skipped | 0 |
| Line coverage | 99.56% |
| Suite command | `node --test --experimental-test-coverage "tests/**/*.test.{js,mjs,ts}"` |

(source: testreport/results-summary.json, testreport/REGENERATE.md)

The suite ran with zero failures and zero skips; every planned test cell passed. Per-category totals are
listed under Test files below (source: testreport/results-summary.json).

## Coverage

Line coverage is **99.56%** across the `src/` TypeScript sources
(source: the review record). The uncovered residue is defensive branches that cannot
be reached through the public API without subclassing internals.

## Test files

| Test file | Category | Cells |
|---|---|---|
| tests/oid_parser.test.js | oid_parsing | 15 |
| tests/oid_parser.test.js (validation cases) | oid_validation | 12 |
| tests/registry.test.js | algorithm_spec | 12 |
| tests/parameter_validator.test.js | parameter_validation_fips203 | 10 |
| tests/parameter_validator.test.js | parameter_validation_fips204 | 10 |
| tests/parameter_validator.test.js | parameter_validation_fips205 | 12 |
| tests/slh_validator.test.js | slh_dsa_validation | 12 |
| tests/golden_vector_crosscheck.test.js | golden_vectors_mlkem | 3 |
| tests/golden_vector_crosscheck.test.js | golden_vectors_mldsa | 3 |
| tests/golden_vector_crosscheck.test.js | golden_vectors_slhdsa | 12 |
| tests/cli.test.js | cli_interface | 21 |
| tests/s8_docs.test.js | documentation | 3 |
| tests/slice6_types_safety.test.js | type_safety | 3 |
| tests/slice5_scaffolding.test.js | package_scaffolding | 3 |
| tests/s10_publish.test.js | publish_prep | 3 |

Total: 128 (source: testreport/results-summary.json; file-to-category mapping from the same report's
categories block and the files present in tests/).

## Official vectors

Golden vectors are stored as JSON fixtures next to the tests and cross-checked in
`tests/golden_vector_crosscheck.test.js`:

| Vector file | Source | sha256 |
|---|---|---|
| tests/golden_vectors_mlkem.json | NIST ACVP FIPS 203 key sizes (Table 3) | `57f9f80bf1dea04a23e020c5b5325128c3a05b4fa315ed432e04e9ff4eb88dbb` |
| tests/golden_vectors_ml_dsa.json | NIST ACVP FIPS 204 Table 2 | `24f6e3d1de286d8c3abcdb66cb0c90a4b875ccb4ef0d4c7e91429f6fee2b8789` |
| tests/golden_vectors_slhdsa.json | NIST ACVP FIPS 205 Table 2 | `1b34b675cd69ab1c2ba87cc5d22447f70e3aff822865858a044695025f279626` |

The sha256 values above were recomputed with `sha256sum` on the current fixture files. Note that
`testreport/REGENERATE.md` lists differently-formatted hash strings for the same files; the values above are
the authoritative ones from this session's recomputation
(reproduced with `sha256sum tests/golden_vectors_*.json` in the repository root).

Vector provenance: each fixture begins with a `"source"` field naming the NIST document it was derived from,
e.g. `tests/golden_vectors_ml_dsa.json` → `"NIST ACVP FIPS 204 Table 2"`. The registry values were verified
against the tables in the FIPS 203/204/205 final publications (August 13, 2024) held in
`brief/references/` (fips203.pdf/txt, fips204.pdf/txt, fips205.pdf/txt).

## How to run

```bash
cd <repo-root>
node --test --experimental-test-coverage "tests/**/*.test.{js,mjs,ts}"
```

Requirements: Node.js v20+ (the recorded run used v26.11.1). No runtime dependencies — the package ships
zero runtime dependencies (source: the review record, License contamination section).

Expected output: `128 tests` reported, `0 failed`, coverage ~99.56% (source: testreport/REGENERATE.md,
the review record).

## What is NOT covered

This suite does not execute any real cryptographic primitive. The registry stores **metadata** — algorithm
names, OIDs, key/signature sizes — for ML-KEM, ML-DSA, and SLH-DSA; it never performs key generation,
encapsulation, signing, or verification, so there is no ciphertext, signature, or key-hydration conformance
testing here and none should be inferred. Liboqs/OpenSSL bindings are out of scope (the package has zero
runtime dependencies). The OID aliases carried in the private-enterprise arc (`1.3.6.1.4.1.59514.1.1.x`) in
`registry_details.ts` are not parsed by the main parser path and are not round-trip tested end-to-end
(source: the review record §5, §6). Timing behavior, constant-time execution, and side-channel
resistance are not applicable and not tested — no secret material is ever handled.
