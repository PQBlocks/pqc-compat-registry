# @pqblocks/pqc-compat-registry

A registry of NIST post-quantum algorithm identifiers — OIDs, key and signature sizes, and security strengths for the 18 FIPS 203/204/205 parameter sets — for developers building PQC compliance and interop tooling.

Use it whenever you need to translate between a NIST parameter-set name (e.g. `ML-KEM-768`), its ASN.1 OID, and its wire-format sizes, without hand-copying tables.

Standards: FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA), RFC 9881 / RFC 9909 / RFC 9935 OID assignments.

## Why PQBlocks

Hand-maintained copies of the FIPS parameter tables drift. This package is a single canonical, typed source of truth: 18 parameter sets with dotted OIDs, component lists, key/signature/shared-secret lengths, and security categories (lambda), plus OID parsing and size validators that throw typed errors.

## Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                     Your application / CLI                   │
│        (compliance report, TLS config, ASN.1 encoder)       │
└───────────────────────────┬──────────────────────────────────┘
                            │ import { algorithms, parse_oid, ... }
                            ▼
┌──────────────────────────────────────────────────────────────┐
│              @pqblocks/pqc-compat-registry              │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  registry.ts    │  │ oid_parser   │  │  validators    │  │
│  │  18 Algorithm-  │  │ parse_oid()  │  │  FIPS 203/204/ │  │
│  │  Spec entries   │  │ validate_oid │  │  205 size      │  │
│  │  + ALL_OIDS     │  │ get_oid_by_  │  │  checks        │  │
│  │                 │  │  algorithm() │  │                │  │
│  └─────────────────┘  └──────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            │ plain data + functions (no crypto)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│   NIST FIPS 203/204/205 parameter tables, RFC 9881/9909/9935 │
│   OID arcs (the registry mirrors these; it does not replace   │
│   a crypto library)                                           │
└──────────────────────────────────────────────────────────────┘
```

The package performs no cryptographic operations. It is identifier/metadata only — use a PQC crypto library (e.g. `@noble/post-quantum`) for key generation, encapsulation, signing, and verification.

## Installation

```bash
npm install @pqblocks/pqc-compat-registry
```

Requires Node.js >= 20. No runtime dependencies; TypeScript types are bundled.

## Usage

```js
import { algorithms, parse_oid, validate_oid, get_oid_by_algorithm,
         validate_parameter_sizes, validate_slh_dsa_sizes, ALL_ALGORITHMS } from '@pqblocks/pqc-compat-registry';

// 1. Look up a parameter set by name
const kem = algorithms['ml-kem-768'];
console.log(kem.oid_dotted);        // '2.16.840.1.101.3.4.4.2'
console.log(kem.key_length);        // 1184 (encapsulation key bytes)
console.log(kem.security_lambda);   // 192

// 2. Parse an OID back to its algorithm
const r = parse_oid('2.16.840.1.101.3.4.3.19');
console.log(r.algorithm);           // 'ml-dsa-87'

// 3. Validate that observed sizes match the FIPS table
console.log(validate_oid('2.16.840.1.101.3.4.4.1'));                 // true
console.log(validate_parameter_sizes('ml-dsa-44',
  { public_key: 2560, private_key: 1312, signature: 2420 }));        // { valid: true, ... }
console.log(validate_slh_dsa_sizes('slh-dsa-sha2-128s',
  { private_key: 64, public_key: 32, signature: 7856 }));            // { valid: true, ... }

// 4. Reverse lookup: name -> OID
console.log(get_oid_by_algorithm('slh-dsa-shake-256f')); // '2.16.840.1.101.3.4.3.31'
console.log(ALL_ALGORITHMS.length);                              // 18
```

CLI: `npx pqc-registry <oid|algorithm>` prints the matching entry as JSON.

## API reference

| Export | Type | Description |
|--------|------|-------------|
| `algorithms` | `Record<Algorithm, AlgorithmSpec>` | All 18 parameter sets: `name`, `fips`, `oid_dotted`, `oid_components`, `key_length`, `signature_length`, `shared_secret_length`, `security_lambda`, `description` |
| `ALL_ALGORITHMS` | `string[]` | The 18 registry keys (`'ml-kem-512'` … `'slh-dsa-shake-256f'`) |
| `ALL_OIDS` | `string[]` | The 18 NIST-arc dotted OIDs |
| `parse_oid(oid: string)` | `(oid) => OIDResult \| null` | Dotted OID -> `{ algorithm, ... }`, or `null` if unregistered; throws typed `E_INVALID_OID` on malformed input |
| `validate_oid(oid)` | `(oid) => boolean` | Never throws; `false` for malformed or unknown input |
| `get_oid_by_algorithm(name)` | `(name) => string` | Throws `E_NOT_REGISTERED` for unknown names and prototype-pollution keys (`__proto__`, `constructor`, `toString`) |
| `validate_parameter_sizes(alg, sizes)` | `(alg, {public_key?, private_key?, signature?, ...}) => SizeValidationResult` | Checks observed sizes against the FIPS 203/204/205 table for `alg` |
| `validate_slh_dsa_sizes(alg, sizes)` | `(alg, {private_key, public_key, signature}) => SLHDSASizeValidation` | SLH-DSA-specific check using FIPS 205 Table 2 (private = 4n bytes) |
| `FIPS_TABLES` | `object` | The canonical size tables used by the validators |
| `version`, `license`, `description`, `packageMeta` | `string`/`object` | Package metadata |

Error contract: malformed OIDs raise `E_INVALID_OID`; unknown algorithms raise `E_NOT_REGISTERED`; both are typed errors with `error_code`, `error_message`, and `suggestion` fields. `validate_oid` is the non-throwing variant.

## Limitations

- Covers exactly the 18 FIPS 203/204/205 parameter sets. Other algorithms (e.g. FN-DSA / FIPS 206, HPKE / RFC 9180, LMS/XMSS / SP 800-208) are not supported and return `E_NOT_REGISTERED`.
- No cryptographic operations: no keygen, encapsulation, signing, or verification.
- No performance claims: lookups are O(1) map accesses; no timing numbers are published.
- Not a FIPS 140-3 / CMVP validated module (see SECURITY_NOTES.md).

## Security notes

This package contains no secrets, no key material, and no cryptographic primitives; it is a pure data registry. It is **not** FIPS 140-3 / CMVP validated. See SECURITY_NOTES.md for the full posture.

## Verification

- TESTING.md — test counts, official NIST ACVP vectors used, how to run.
- BENCHMARKS.md — correctness harness results and reproduction.
- EVIDENCE.md — mapping of every registry field to its primary standard source.
- VERIFICATION_REPORT.md — self-verification summary, defects fixed, known limitations.

## Part of PQBlocks

`@pqblocks/pqc-compat-registry` is part of the PQBlocks family of post-quantum packages. Apache-2.0 licensed.
