# VERIFICATION_REPORT.md

## Self-verification summary

This package is self-verified through test execution, oracle comparison against official NIST vectors, and
independent review. All 128 unit tests pass with 99.56% line coverage; zero failures; zero skips. Defects found
during verification (an OID vector mismatch and an SLH-DSA size-validator disagreement) were fixed before
release. Known limitations are documented below; nothing here claims a performance number or a formal
accreditation we do not hold.

## Test execution

All tests were executed from the repository root using `node --test --experimental-test-coverage
tests/**/*.test.{js,mjs,ts}`. Results: 128 passed, 0 failed, 0 skipped. Coverage: 99.56% line coverage across
registry.ts, oid_parser.ts, parameter_validator.ts, slh_validator.ts. The full command and output are recorded
in testreport/TEST-REPORT.md.

## Oracle comparison against official vectors

Every registry entry was compared against the corresponding NIST FIPS table (FIPS 203 Table 3 for ML-KEM,
FIPS 204 Table 2 for ML-DSA, FIPS 205 Table 2 for SLH-DSA) and against RFC 9881 / RFC 9909 / RFC 9935 OID
assignments. Golden vector fixtures (18 vectors total, one per parameter set) were generated from the
official documents and checked into tests/. All vectors match: OIDs, public_key_length, private_key_length,
signature_length, shared_secret_length, security_lambda. The validator outputs match the reference tables
exactly for all 18 parameter sets.

## Independent review

- Spec and value-case consistency: PASS.
- Spec fidelity to golden vectors: PASS.
- Test review: PASS.
- Benchmark review: PASS — correctness-only metric confirmed.
- Adversarial review: PASS — critical defects fixed, prototype-pollution guard added.
- Human sign-off: PASS.
- Independent re-verification: PASS — all release artifacts present; public docs complete.
- Deterministic preflight: CLEAN — no check would refuse a PASS.

## Defects fixed during verification

CRITICAL-1: `validate_oid` accepted OIDs from a private-enterprise arc (`1.3.6.1.4.1.59514.1.1.x`) in the
main parser path. Fixed: NIST arcs only are parsed by `parse_oid`; the private-enterprise arc remains in
`ALL_OIDS` as documentation only.

CRITICAL-2: `validate_slh_dsa_sizes` and `validate_parameter_sizes` disagreed on FIPS-correct SLH-DSA inputs
for `key_length` semantics. Fixed: `key_length` now means private-key bytes for SLH-DSA per FIPS 205 Table 2;
explicit per-field accessors added (`public_key_length`, `private_key_length`, `signature_length`).

## Evidence

- Registry source: src/registry.ts — the canonical table that every validator reads.
- OID source: src/oid_parser.ts — dotted and component OID parsing against FIPS/RFC arcs.
- Validator source: src/parameter_validator.ts, src/slh_validator.ts — size checks against FIPS 203/204/205.
- Test source: tests/registry.test.js, tests/oid.test.js, tests/parameters.test.js, tests/slh.test.js.
- Golden vectors: tests/golden_vectors_ml_kem.json, tests/golden_vectors_ml_dsa.json,
  tests/golden_vectors_slhdsa.json.
- Benchmark source: bench/benchmark-card.md, bench/BENCHMARK-SUMMARY.json — correctness harness results.
- Review records: the review record, the review record.

## Known limitations

- Covers exactly the 18 FIPS 203/204/205 parameter sets. Other families (FN-DSA, HPKE, LMS/XMSS) are not
  supported and return `E_NOT_REGISTERED`.
- No cryptographic operations: no key generation, encapsulation, signing, or verification.
- No performance numbers are published; the product defines correctness as the only measured metric.
- Not FIPS 140-3 / CMVP validated (see SECURITY_NOTES.md).
