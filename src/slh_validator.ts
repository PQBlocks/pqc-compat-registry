// src/slh_validator.ts — SLH-DSA (FIPS 205) parameter size validation
// All sizes sourced from FIPS 205 Table 2 (primary source: brief/references/fips205.txt lines 2241-2263):
//   private_key = 4n (SK.seed || SK.prf || PK.seed || PK.root)
//   public_key  = 2n (PK.seed || PK.root), per "pk bytes" column of Table 2
//   signature   = per "sig bytes" column of Table 2
// SHA2 and SHAKE variants sharing the same n have identical sizes per Table 2.
// Composes with registry.ts (canonical building block) — cross-checked against registry entries.
// Public API:
// - SLH_DSA_TABLES: { fips205 } canonical size tables
// - get_expected_slh_sizes(algorithm): expected sizes for a registered SLH-DSA algorithm (throws E_NOT_REGISTERED)
// - validate_slh_dsa_sizes(algorithm, sizes): {valid: true} or {valid: false, errors} (throws E_NOT_REGISTERED)

// SLH_DSA_TABLES mirrors FIPS 205 Table 2 exactly.
// private_key = 4n, public_key = 2n, signature = per Table 2 sig bytes column.
// Verified against brief/references/fips205.txt lines 2241-2263.
export const SLH_DSA_TABLES: { fips205: Record<string, { private_key: number; public_key: number; signature: number }> } = {
  fips205: {
    // n=16, security category 1: private_key=64 (4n), public_key=32 (2n)
    'slh-dsa-sha2-128s': { private_key: 64, public_key: 32, signature: 7856 },
    'slh-dsa-shake-128s': { private_key: 64, public_key: 32, signature: 7856 },
    // n=16, security category 1 (fast): private_key=64 (4n), public_key=32 (2n)
    'slh-dsa-sha2-128f': { private_key: 64, public_key: 32, signature: 17088 },
    'slh-dsa-shake-128f': { private_key: 64, public_key: 32, signature: 17088 },
    // n=24, security category 3: private_key=96 (4n), public_key=48 (2n)
    'slh-dsa-sha2-192s': { private_key: 96, public_key: 48, signature: 16224 },
    'slh-dsa-shake-192s': { private_key: 96, public_key: 48, signature: 16224 },
    // n=24, security category 3 (fast): private_key=96 (4n), public_key=48 (2n)
    'slh-dsa-sha2-192f': { private_key: 96, public_key: 48, signature: 35664 },
    'slh-dsa-shake-192f': { private_key: 96, public_key: 48, signature: 35664 },
    // n=32, security category 5: private_key=128 (4n), public_key=64 (2n)
    'slh-dsa-sha2-256s': { private_key: 128, public_key: 64, signature: 29792 },
    'slh-dsa-shake-256s': { private_key: 128, public_key: 64, signature: 29792 },
    // n=32, security category 5 (fast): private_key=128 (4n), public_key=64 (2n)
    'slh-dsa-sha2-256f': { private_key: 128, public_key: 64, signature: 49856 },
    'slh-dsa-shake-256f': { private_key: 128, public_key: 64, signature: 49856 },
  },
};

/**
 * Return the expected (canonical) FIPS 205 size table entry for a registered SLH-DSA algorithm.
 * @param algorithm - Registered algorithm identifier (e.g. 'slh-dsa-sha2-128s')
 * @returns Expected sizes object keyed by field name
 * @throws {Error} E_NOT_REGISTERED when algorithm is not in the SLH-DSA tables
 */
export function get_expected_slh_sizes(algorithm: string): { private_key: number; public_key: number; signature: number } {
  if (!SLH_DSA_TABLES.fips205[algorithm]) {
    throw new Error(
      `E_NOT_REGISTERED: Algorithm '${algorithm}' is not registered in the FIPS 205 SLH-DSA parameter tables.`
    );
  }
  return SLH_DSA_TABLES.fips205[algorithm];
}

/**
 * Validate supplied sizes against the canonical FIPS 205 Table 2 for the given SLH-DSA algorithm.
 * Only the expected fields for that algorithm are validated; extra unexpected fields are ignored.
 * Missing required fields, zero/negative values, and mismatched values each produce an error entry.
 * @param algorithm - Registered SLH-DSA algorithm identifier
 * @param sizes - Candidate sizes to validate
 * @returns { valid: true } when all expected fields match; otherwise
 *          { valid: false, errors: string[] } describing each failure
 * @throws {Error} E_NOT_REGISTERED when algorithm is not in the registry
 */
export function validate_slh_dsa_sizes(
  algorithm: string,
  sizes: Record<string, number>
): { valid: true } | { valid: false; errors: string[] } {
  if (!SLH_DSA_TABLES.fips205[algorithm]) {
    throw new Error(
      `E_NOT_REGISTERED: Algorithm '${algorithm}' is not registered in the FIPS 205 SLH-DSA parameter tables.`
    );
  }

  const expected = SLH_DSA_TABLES.fips205[algorithm];
  const errors: string[] = [];

  // Validate each expected field: private_key, public_key, signature
  const expectedFields = ['private_key', 'public_key', 'signature'] as const;
  for (const field of expectedFields) {
    const actual = sizes[field];
    const expect = expected[field];

    if (actual === undefined) {
      errors.push(`${algorithm}.${field}: missing required size field`);
      continue;
    }

    if (typeof actual !== 'number' || !Number.isFinite(actual) || actual <= 0) {
      errors.push(`${algorithm}.${field}: must be a positive finite number, got ${JSON.stringify(actual)}`);
      continue;
    }

    if (actual !== expect) {
      errors.push(
        `${algorithm}.${field}: expected ${expect} bytes per FIPS 205 Table 2, got ${actual}`
      );
    }
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}