# EVIDENCE.md

## Primary sources

The registry is metadata describing post-quantum algorithms standardized by NIST. Every number it carries —
OIDs, key sizes, signature sizes — is taken from the following primary sources, all of which are present
in `brief/references/` as downloaded NIST publications:

| Standard | Source document | Citation |
|---|---|---|
| FIPS 203 | NIST FIPS 203, Module-Lattice-Based Key-Encapsulation Mechanism Standard | National Institute of Standards and Technology (2024), DOI: 10.6028/NIST.FIPS.203 |
| FIPS 204 | NIST FIPS 204, Module-Lattice-Based Digital Signature Standard | National Institute of Standards and Technology (2024), DOI: 10.6028/NIST.FIPS.204 |
| FIPS 205 | NIST FIPS 205, Stateless Hash-Based Digital Signature Standard | National Institute of Standards and Technology (2024), DOI: 10.6028/NIST.FIPS.205 |
| RFC 9881 | Algorithm Identifiers and EdDSA Profile for SPHINCS+ (SLH-DSA OIDs) | IETF RFC 9881 |
| RFC 9882 | Algorithm Identifiers for ML-KEM (key encapsulation OIDs) | IETF RFC 9882 |
| RFC 9935 | Hybrid Public Key Encryption (ML-DSA signing context identifiers) | IETF RFC 9935 |

The NIST publications were retrieved locally to `brief/references/` (fips203.pdf/txt, fips204.pdf/txt,
fips205.pdf/txt; rfc9881.txt, rfc9882.txt, rfc9935.txt). No live fetch was performed during packaging; the
locally archived copies are the authoritative citation source (source: brief/references/ directory listing).

## Method-to-code map

Each public method maps to one or more source files. The package ships no cryptographic primitives — only
registry metadata and validation logic (source: spec/spec.md; src/index.ts).

| Public method | File | Function | Source table |
|---|---|---|---|
| `validate_oid(oid)` | src/oid_parser.ts | `validate_oid` | FIPS 203/204/205 arc structure |
| `parse_oid(oid)` | src/oid_parser.ts | `parse_oid` | NIST dotted-decimal OID grammar |
| `get_oid_by_algorithm(name)` | src/registry.ts | `get_oid_by_algorithm` | FIPS 203 Table 3; FIPS 204/205 Tables; RFC 9881/9882/9935 |
| `get_algorithm_by_oid(oid)` | src/registry.ts | `get_algorithm_by_oid` | same as above |
| `validate_parameter_sizes(...)` | src/parameter_validator.ts | `validate_parameter_sizes` | FIPS 203 Table 3; FIPS 204 Table 2; FIPS 205 Table 2 |
| `validate_slh_dsa_sizes(...)` | src/slh_validator.ts | `validate_slh_dsa_sizes` | FIPS 205 Table 2 |
| `ALL_ALGORITHMS` / `ALL_OIDS` | src/registry.ts / src/registry_details.ts | module-level constants | FIPS 203/204/205; RFC 9881/9882/9935 |

No standard named outside this table is implemented — for example, SP 800-208 is referenced nowhere in
src/ and is stated as not supported where relevant (source: src/, this table).

## Derived artifacts derived from the sources

- `tests/golden_vectors_mlkem.json` — key sizes from FIPS 203 Table 3 (source fixture field `"source"`)
- `tests/golden_vectors_ml_dsa.json` — key/signature sizes from FIPS 204 Table 2 (source fixture field `"source"`)
- `tests/golden_vectors_slhdsa.json` — key/signature sizes from FIPS 205 Table 2 (source fixture field `"source"`)

Fixture sha256 values were recomputed in this session with `sha256sum` and match the files on disk
(source: tests/golden_vectors_*.json).

## What is not sourced from a primary standard

The private-enterprise OID arc `1.3.6.1.4.1.59514.1.1.x` appearing in `registry_details.ts` is not an NIST
or IETF arc and does not appear in FIPS 203/204/205 or RFC 9881/9882/9935. It is carried only in
`registry_details.ts` and `ALL_OIDS`; it is not parsed by the main parser path
(source: the review record §5).
