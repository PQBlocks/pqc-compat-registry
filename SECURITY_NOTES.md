# SECURITY_NOTES.md

## What it protects and what it does not

`@pqblocks/pqc-compat-registry` protects **correct identifier handling** in PQC tooling: it lets a caller
translate between a NIST parameter-set name and its ASN.1 OID, and validate that observed key/signature sizes
match the FIPS 203/204/205 tables. Using the wrong OID or the wrong wire-format size breaks interoperability
and can cause silent handshake failures; this package removes that class of mistake by providing a single
canonical source of truth.

## What it does NOT protect

- **It performs no cryptography.** There is no key generation, encapsulation, signing, or verification code.
- **It validates identifiers only.** It does not validate certificates, handshakes, signatures, or ciphertexts.
- **It is not FIPS 140-3 / CMVP validated.** Nothing built on this package may claim FIPS validation.
- **It is not a replacement for a PQC crypto library.** Pair it with a cryptography implementation for actual
  primitive operations.

## Hostile input

Every public entry point treats its input as hostile. `validate_oid` never throws and returns `false` for
malformed or unknown OIDs; `parse_oid` and `get_oid_by_algorithm` throw typed errors (`E_INVALID_OID`,
`E_NOT_REGISTERED`) with `error_code`, `error_message`, and `suggestion` fields on bad input, including
prototype-pollution keys such as `__proto__`, `constructor`, and `toString`. No input is evaluated, no path
is read from input, and no memory is allocated proportional to attacker-controlled sizes beyond the input
string itself. There are no resource limits to configure because the package performs no I/O, no network
access, and no file access at runtime.

## Constant-time status

Constant-time execution is **not applicable**: the package handles no secret material, so there is nothing to
protect from timing observation. Lookups are plain object-map accesses over public metadata. Do not feed
secret keys through this package; it never handles them, but it also offers no constant-time guarantee if
you misuse it that way.

## Zeroization

Zeroization is **not applicable**: no secret buffers exist in this package, so there is nothing to wipe. The
package stores only public, standards-derived constants (OID strings and integer sizes).

## Randomness source

This package uses **no randomness**. No `Math.random()`, no `crypto.randomBytes()`, no entropy source of any
kind — the registry is deterministic pure data, which is what makes it safe to embed in build pipelines.

## Dependencies

The package has zero runtime dependencies. Dev dependencies are limited to TypeScript and `@types/node` for
type checking and the build. The CLI tool (`bin/registry-cli.js`) is a thin wrapper over the registry API and
introduces no additional dependencies.

## Audit status

The package is self-verified against official NIST FIPS 203/204/205 tables and RFC OID assignments (see
VERIFICATION_REPORT.md); this is self-verification, **not a third-party audit**, and it confers no
FIPS 140-3 / CMVP validation. No external security audit has been performed or is claimed. Open findings:
the private-enterprise OID arc `1.3.6.1.4.1.59514.1.1.x` carried in `ALL_OIDS` is documentation only and
is not parsed by the main parser path.

## Integration guidance

- Treat every exported value as untrusted until your caller validates it against its own policy.
- `validate_oid` never throws — use it as a gate before `parse_oid` or `get_oid_by_algorithm`, which throw
  typed errors (`E_INVALID_OID`, `E_NOT_REGISTERED`) on bad input.
- Do not log secret keys or private material through this package (it never handles them, but your caller might).
- The private-enterprise arc `1.3.6.1.4.1.59514.1.1.x` appears in `ALL_OIDS` as documentation only and is not
  parsed by the main parser path.
