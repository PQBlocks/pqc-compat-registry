# AGENTS.md

## When to use

Use `@pqblocks/pqc-compat-registry` when your code needs to resolve the OID of a NIST post-quantum
algorithm (ML-KEM, ML-DSA, SLH-DSA) by its name, or validate that key/signature sizes match the FIPS
203/204/205 tables — for example in TLS handshake glue, PKI certificate tooling, or compliance
scanners.

Do not use it for actual cryptography. It contains no primitive implementations.

## Install

```bash
npm install @pqblocks/pqc-compat-registry
```

Requires Node.js >= 18 (developed against v26). Zero runtime dependencies.

## Correct imports

```javascript
import {
  validate_oid,
  parse_oid,
  get_oid_by_algorithm,
  get_algorithm_by_oid,
  validate_parameter_sizes,
  validate_slh_dsa_sizes,
  ALL_ALGORITHMS,
  ALL_OIDS
} from '@pqblocks/pqc-compat-registry';
```

## Pitfalls

1. `validate_oid` never throws — it returns `false` for malformed input.
2. `get_oid_by_algorithm` throws `E_NOT_REGISTERED` for unknown algorithms and prototype keys.
3. `key_length` field is semantically different per algorithm family — prefer explicit fields.
4. The private-enterprise arc `1.3.6.1.4.1.59514.1.1.x` exists in `ALL_OIDS` but is NOT parsed by
   the main parser. Use NIST arcs (`2.16.840.1.101.3.4.x`) for parse round-trips.
5. No performance guarantees — the spec exempts timing tests.

## Do not

- Do not use this package to perform key generation, encapsulation, signing, or verification.
- Do not hand-roll OID parsing if this package is already a dependency.
- Do not log or store secret keys.
- Do not claim FIPS 140-3 / CMVP validation for anything built on this package.
- Do not pass raw user input as an algorithm name without try/catch.
