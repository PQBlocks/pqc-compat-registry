// src/parameter_validator.ts — FIPS 203/204/205 parameter size validation
// All sizes sourced from primary standards:
//   FIPS 203 Table 3 (ML-KEM keys/ciphertexts)
//   FIPS 204 Table 2 (ML-DSA keys/signatures)
//   FIPS 205 Table 2 (SLH-DSA keys/signatures)

export interface SizeValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface ExpectedSizes {
  [key: string]: number;
}

// FIPS 203 Table 3 — ML-KEM key and ciphertext sizes (in bytes)
const FIPS_203: Record<string, ExpectedSizes> = {
  'ml-kem-512': {
    encapsulation_key: 800,
    decapsulation_key: 1632,
    ciphertext: 768,
    shared_secret: 32,
  },
  'ml-kem-768': {
    encapsulation_key: 1184,
    decapsulation_key: 2400,
    ciphertext: 1088,
    shared_secret: 32,
  },
  'ml-kem-1024': {
    encapsulation_key: 1568,
    decapsulation_key: 3168,
    ciphertext: 1568,
    shared_secret: 32,
  },
};

// FIPS 204 Table 2 — ML-DSA key and signature sizes (in bytes)
const FIPS_204: Record<string, ExpectedSizes> = {
  'ml-dsa-44': { private_key: 2560, public_key: 1312, signature: 2420 },
  'ml-dsa-65': { private_key: 4032, public_key: 1952, signature: 3309 },
  'ml-dsa-87': { private_key: 4896, public_key: 2592, signature: 4627 },
};

// FIPS 205 Table 2 — SLH-DSA key and signature sizes (in bytes)
const FIPS_205: Record<string, ExpectedSizes> = {
  'slh-dsa-sha2-128s': { private_key: 64, public_key: 32, signature: 7856 },
  'slh-dsa-sha2-128f': { private_key: 64, public_key: 32, signature: 17088 },
  'slh-dsa-sha2-192s': { private_key: 96, public_key: 48, signature: 16224 },
  'slh-dsa-sha2-192f': { private_key: 96, public_key: 48, signature: 35664 },
  'slh-dsa-sha2-256s': { private_key: 128, public_key: 64, signature: 29792 },
  'slh-dsa-sha2-256f': { private_key: 128, public_key: 64, signature: 49856 },
  'slh-dsa-shake-128s': { private_key: 64, public_key: 32, signature: 7856 },
  'slh-dsa-shake-128f': { private_key: 64, public_key: 32, signature: 17088 },
  'slh-dsa-shake-192s': { private_key: 96, public_key: 48, signature: 16224 },
  'slh-dsa-shake-192f': { private_key: 96, public_key: 48, signature: 35664 },
  'slh-dsa-shake-256s': { private_key: 128, public_key: 64, signature: 29792 },
  'slh-dsa-shake-256f': { private_key: 128, public_key: 64, signature: 49856 },
};

export const FIPS_TABLES = {
  fips203: FIPS_203,
  fips204: FIPS_204,
  fips205: FIPS_205,
} as const;

export const FIPS_STANDARDS = {
  'ml-kem-512': 'fips203',
  'ml-kem-768': 'fips203',
  'ml-kem-1024': 'fips203',
  'ml-dsa-44': 'fips204',
  'ml-dsa-65': 'fips204',
  'ml-dsa-87': 'fips204',
  'slh-dsa-sha2-128s': 'fips205',
  'slh-dsa-sha2-128f': 'fips205',
  'slh-dsa-sha2-192s': 'fips205',
  'slh-dsa-sha2-192f': 'fips205',
  'slh-dsa-sha2-256s': 'fips205',
  'slh-dsa-sha2-256f': 'fips205',
  'slh-dsa-shake-128s': 'fips205',
  'slh-dsa-shake-128f': 'fips205',
  'slh-dsa-shake-192s': 'fips205',
  'slh-dsa-shake-192f': 'fips205',
  'slh-dsa-shake-256s': 'fips205',
  'slh-dsa-shake-256f': 'fips205',
} as const;

export function get_expected_sizes(algorithm: string): ExpectedSizes {
  const standard = FIPS_STANDARDS[algorithm as keyof typeof FIPS_STANDARDS];
  if (!standard) {
    const err = new Error(`E_NOT_REGISTERED: algorithm '${algorithm}' is not registered`);
    (err as Error & { code?: string }).code = 'E_NOT_REGISTERED';
    throw err;
  }
  const table = FIPS_TABLES[standard as keyof typeof FIPS_TABLES];
  const sizes = table[algorithm as keyof typeof table];
  if (!sizes) {
    const err = new Error(`E_NOT_REGISTERED: algorithm '${algorithm}' is not registered`);
    (err as Error & { code?: string }).code = 'E_NOT_REGISTERED';
    throw err;
  }
  return { ...sizes };
}

export function validate_parameter_sizes(
  algorithm: string,
  sizes: Record<string, unknown>
): SizeValidationResult {
  let expected: ExpectedSizes;
  try {
    expected = get_expected_sizes(algorithm);
  } catch {
    const err = new Error(`E_NOT_REGISTERED: algorithm '${algorithm}' is not registered`);
    (err as Error & { code?: string }).code = 'E_NOT_REGISTERED';
    throw err;
  }

  const errors: string[] = [];

  for (const [field, expectedValue] of Object.entries(expected)) {
    const actual = sizes[field];
    if (actual === undefined) {
      errors.push(`missing required field: ${field}`);
      continue;
    }
    if (typeof actual !== 'number' || !Number.isFinite(actual) || actual <= 0) {
      errors.push(`invalid value for ${field}: must be a positive number`);
      continue;
    }
    if (actual !== expectedValue) {
      errors.push(
        `mismatched ${field}: expected ${expectedValue}, got ${actual}`
      );
    }
  }

  if (errors.length === 0) {
    return { valid: true };
  }
  return { valid: false, errors };
}
