// src/registry_details.ts — Detailed algorithm registry metadata
// Extends registry.ts with additional algorithm detail structures and lookups
// Implements secondary index structures for algorithm discovery

export interface Algorithm {
  name: string;
  oid: string;
  type: string;
  level: number;
  rfc?: string;
}

/** All 21 NIST PQC algorithm identifiers as a readonly tuple */
export const ALL_ALGORITHMS: ReadonlyArray<Algorithm> = [
  // ML-KEM (FIPS 203)
  { name: 'ml-kem-512', oid: '1.3.6.1.4.1.59514.1.1.1', type: 'ml-kem', level: 1 },
  { name: 'ml-kem-768', oid: '1.3.6.1.4.1.59514.1.1.2', type: 'ml-kem', level: 1 },
  { name: 'ml-kem-1024', oid: '1.3.6.1.4.1.59514.1.1.3', type: 'ml-kem', level: 1 },
  // ML-DSA (FIPS 204)
  { name: 'ml-dsa-44', oid: '1.3.6.1.4.1.59514.1.1.4', type: 'ml-dsa', level: 2 },
  { name: 'ml-dsa-65', oid: '1.3.6.1.4.1.59514.1.1.5', type: 'ml-dsa', level: 2 },
  { name: 'ml-dsa-87', oid: '1.3.6.1.4.1.59514.1.1.6', type: 'ml-dsa', level: 2 },
  // SLH-DSA (FIPS 205)
  { name: 'slh-dsa-sha2-128s', oid: '1.3.6.1.4.1.59514.1.1.7', type: 'slh-dsa', level: 1 },
  { name: 'slh-dsa-sha2-128f', oid: '1.3.6.1.4.1.59514.1.1.8', type: 'slh-dsa', level: 1 },
  { name: 'slh-dsa-sha2-192s', oid: '1.3.6.1.4.1.59514.1.1.9', type: 'slh-dsa', level: 3 },
  { name: 'slh-dsa-sha2-192f', oid: '1.3.6.1.4.1.59514.1.1.10', type: 'slh-dsa', level: 3 },
  { name: 'slh-dsa-sha2-256s', oid: '1.3.6.1.4.1.59514.1.1.11', type: 'slh-dsa', level: 5 },
  { name: 'slh-dsa-sha2-256f', oid: '1.3.6.1.4.1.59514.1.1.12', type: 'slh-dsa', level: 5 },
  // SLH-DSA SHAKE (FIPS 205)
  { name: 'slh-dsa-shake-128s', oid: '1.3.6.1.4.1.59514.1.1.13', type: 'slh-dsa', level: 1 },
  { name: 'slh-dsa-shake-128f', oid: '1.3.6.1.4.1.59514.1.1.14', type: 'slh-dsa', level: 1 },
  { name: 'slh-dsa-shake-192s', oid: '1.3.6.1.4.1.59514.1.1.15', type: 'slh-dsa', level: 3 },
  { name: 'slh-dsa-shake-192f', oid: '1.3.6.1.4.1.59514.1.1.16', type: 'slh-dsa', level: 3 },
  { name: 'slh-dsa-shake-256s', oid: '1.3.6.1.4.1.59514.1.1.17', type: 'slh-dsa', level: 5 },
  { name: 'slh-dsa-shake-256f', oid: '1.3.6.1.4.1.59514.1.1.18', type: 'slh-dsa', level: 5 },
];

/** Index mapping algorithm name → Algorithm entry */
export const ALGORITHM_INDEX: Readonly<Record<string, Algorithm>> = (() => {
  const m: Record<string, Algorithm> = {};
  for (const a of ALL_ALGORITHMS) {
    m[a.name] = a;
  }
  return m;
})();

/** Index mapping OID → Algorithm entry */
export const OID_INDEX: Readonly<Record<string, Algorithm>> = (() => {
  const m: Record<string, Algorithm> = {};
  for (const a of ALL_ALGORITHMS) {
    m[a.oid] = a;
  }
  return m;
})();

/** Index mapping security level → array of algorithm names at that level */
export const BY_LEVEL: Readonly<Record<number, ReadonlyArray<string>>> = (() => {
  const m: Record<number, Array<string>> = { 1: [], 2: [], 3: [], 5: [] };
  for (const a of ALL_ALGORITHMS) {
    if (m[a.level]) m[a.level].push(a.name);
  }
  return m as Record<number, ReadonlyArray<string>>;
})();

/** Validate that an algorithm name is registered */
export function is_algorithm_registered(name: string): boolean {
  return name in ALGORITHM_INDEX;
}

/** Look up algorithm details by name */
export function lookup_algorithm(name: string): Algorithm | undefined {
  return ALGORITHM_INDEX[name];
}

/** Look up algorithm details by OID */
export function lookup_by_oid(oid: string): Algorithm | undefined {
  return OID_INDEX[oid];
}

/** Get all algorithms at a given security level */
export function get_algorithms_at_level(level: number): ReadonlyArray<Algorithm> {
  const names = BY_LEVEL[level];
  return names.map(n => ALGORITHM_INDEX[n]!).filter(Boolean) as ReadonlyArray<Algorithm>;
}

/** Get all OIDs for a given security level */
export function get_oids_at_level(level: number): ReadonlyArray<string> {
  const names = BY_LEVEL[level];
  return names.map(n => ALGORITHM_INDEX[n]!.oid);
}

/** Get all algorithm names sorted by level then name */
export function get_sorted_algorithms(): ReadonlyArray<string> {
  return [...ALL_ALGORITHMS].sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name);
  }).map(a => a.name);
}
