# USE_CASES.md

## Scenario 1: TLS library integration — resolve algorithm OID during handshake

A TLS terminator needs to translate a PQC algorithm name received in a ClientHello extension into the
dotted OID for the server certificate's AlgorithmIdentifier field.

```javascript
import { get_oid_by_algorithm, validate_oid } from '@pqblocks/pqc-compat-registry';

const algo = 'ml-kem-768';
const oid = get_oid_by_algorithm(algo);
console.log('OID:', oid); // 2.16.840.1.101.3.4.3.5

// Later: validate a peer's AlgorithmIdentifier OID
const peerOid = '2.16.840.1.101.3.4.3.5';
if (!validate_oid(peerOid)) {
  throw new Error('Peer presented invalid PQC OID');
}
console.log('OK');
```

Expected output:
```
OID: 2.16.840.1.101.3.4.3.5
OK
```

## Scenario 2: PKI tooling — validate key/signature sizes before issuance

A CA automation script verifies that a submitted CSR carries keys and signatures matching the FIPS tables
before issuing a certificate.

```javascript
import { validate_parameter_sizes, validate_slh_dsa_sizes } from '@pqblocks/pqc-compat-registry';

// ML-DSA-65 parameters from a CSR
const mldsa65 = {
  algorithm: 'ml-dsa-65',
  private_key: 4032,
  public_key: 1952,
  signature: 3309
};
const res = validate_parameter_sizes(mldsa65.algorithm, mldsa65);
if (!res.valid) {
  console.error('ML-DSA-65 size mismatch:', res.errors);
  process.exit(1);
}

// SLH-DSA-SHA2-128s parameters
const slhdsa = {
  algorithm: 'slh-dsa-sha2-128s',
  private_key: 64,
  public_key: 32,
  signature: 7856
};
const res2 = validate_slh_dsa_sizes(slhdsa.algorithm, slhdsa);
if (!res2.valid) {
  console.error('SLH-DSA size mismatch:', res2.errors);
  process.exit(1);
}
console.log('OK');
```

Expected output:
```
OK
```

## Scenario 3: CLI-driven audit — enumerate all registered PQC algorithms and their OIDs

An operator runs a one-liner to produce a compliance report of all algorithms the registry knows.

```bash
npx @pqblocks/pqc-compat-registry list --format=table
```

Sample output:
```
algorithm          oid                              key_length  public  private  sig/cipher
ml-kem-512         2.16.840.1.101.3.4.3.4           800         800     1632     768
ml-kem-768         2.16.840.1.101.3.4.3.5           1184        1184    2400     1088
ml-kem-1024        2.16.840.1.101.3.4.3.6           1568        1568    3168     1568
ml-dsa-44          2.16.840.1.101.3.4.3.17          2560        1312    2560     2420
ml-dsa-65          2.16.840.1.101.3.4.3.18          4032        1952    4032     3309
ml-dsa-87          2.16.840.1.101.3.4.3.19          4896        2592    4896     4627
slh-dsa-sha2-128s  2.16.840.1.101.3.4.3.25          64          32      64       7856
slh-dsa-sha2-128f  2.16.840.1.101.3.4.3.26          64          32      64       17088
...
```

Expected: exits 0, prints a table with 26 rows (6 ML-KEM + 8 ML-DSA + 12 SLH-DSA).

## Workflow diagram

```
User / Application
      │
      │ 1. Request OID for algorithm name
      ▼
┌─────────────────────────────────────────────┐
│  get_oid_by_algorithm(name)                 │
│  (src/registry.ts)                          │
└─────────────────────────────────────────────┘
      │
      │ 2. Return dotted OID string (e.g., 2.16.840.1.101.3.4.3.5)
      ▼
User / Application
      │
      │ 3. Validate peer's OID during handshake / CSR inspection
      ▼
┌─────────────────────────────────────────────┐
│  validate_oid(peerOid)                      │
│  (src/oid_parser.ts)                        │
└─────────────────────────────────────────────┘
      │
      │ 4. Return true/false (never throws)
      ▼
      │
      │ 5. Validate key/signature sizes against FIPS tables
      ▼
┌─────────────────────────────────────────────┐
│  validate_parameter_sizes(algo, params)     │
│  (src/parameter_validator.ts)               │
│  validate_slh_dsa_sizes(algo, params)       │
│  (src/slh_validator.ts)                     │
└─────────────────────────────────────────────┘
      │
      │ 6. Return { valid: boolean, errors?: string[] }
      ▼
User / Application continues with validated metadata
```

## When to use something else

- **You need actual cryptography**: This package only holds metadata. Use liboqs, OpenSSL 3, or a
  FIPS-validated module for key generation, encapsulation, signing, or verification.
- **You need CMVP/FIPS 140-3 validation**: This package is **not** FIPS 140-3 / CMVP validated.
- **You need performance benchmarks**: The spec exempts performance testing; no latency numbers are
  published.
- **You need X.509 parsing/ASN.1 encoding**: This package only knows dotted OIDs and size tables; it
  does not parse or emit DER/ASN.1 structures.
- **You need hybrid KEM combos**: RFC 9909 hybrid schemes are not encoded in the registry.