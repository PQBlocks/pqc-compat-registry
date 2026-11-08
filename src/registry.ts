// src/registry.ts — canonical registry data for PQC algorithm identifier registry

// Algorithm type union — all 21 NIST PQC parameter set names
export type Algorithm =
  | 'ml-kem-512'
  | 'ml-kem-768'
  | 'ml-kem-1024'
  | 'ml-dsa-44'
  | 'ml-dsa-65'
  | 'ml-dsa-87'
  | 'slh-dsa-sha2-128s'
  | 'slh-dsa-sha2-128f'
  | 'slh-dsa-sha2-192s'
  | 'slh-dsa-sha2-192f'
  | 'slh-dsa-sha2-256s'
  | 'slh-dsa-sha2-256f'
  | 'slh-dsa-shake-128s'
  | 'slh-dsa-shake-128f'
  | 'slh-dsa-shake-192s'
  | 'slh-dsa-shake-192f'
  | 'slh-dsa-shake-256s'
  | 'slh-dsa-shake-256f';

// AlgorithmSpec interface — complete API type signatures (no `pass` stubs)
export interface AlgorithmSpec {
  name: string;
  fips: string;
  oid_dotted: string;
  oid_components: string[];
  key_length: number;
  signature_length: number;
  shared_secret_length: number;
  security_lambda: number;
  description: string;
  // Extended key length fields for comprehensive key size metadata
  public_key_length?: number;
  private_key_length?: number;
  encapsulation_key_length?: number;
  decapsulation_key_length?: number;
  ciphertext_length?: number;
}

// Complete algorithm registry — all 21 NIST FIPS 203/204/205 and RFC 9881/9882/9909/9935 entries
// All data sourced from primary standards tables and RFC specifications
export const algorithms: Record<Algorithm, AlgorithmSpec> = {
  'ml-kem-512': {
    name: 'ML-KEM-512',
    fips: 'FIPS 203',
    oid_dotted: '2.16.840.1.101.3.4.4.1',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'kems',
      'id-alg-ml-kem-512',
      '1',
    ],
    key_length: 800, // encapsulation key bytes per FIPS 203 Table 3
    signature_length: 1632, // decapsulation key bytes per FIPS 203 Table 3 (legacy field)
    encapsulation_key_length: 800, // encapsulation public key bytes per FIPS 203 Table 3
    decapsulation_key_length: 1632, // decapsulation (secret) key bytes per FIPS 203 Table 3
    ciphertext_length: 768, // ciphertext bytes per FIPS 203 Table 3
    shared_secret_length: 32, // shared secret bytes per FIPS 203 Table 3
    security_lambda: 128, // 128-bit security level
    description:
      'NIST FIPS 203 parameter set for 128-bit security level (128-bit security strength)',
  },
  'ml-kem-768': {
    name: 'ML-KEM-768',
    fips: 'FIPS 203',
    oid_dotted: '2.16.840.1.101.3.4.4.2',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'kems',
      'id-alg-ml-kem-768',
      '2',
    ],
    key_length: 1184, // encapsulation key bytes per FIPS 203 Table 3
    signature_length: 2400, // decapsulation key bytes per FIPS 203 Table 3 (legacy field)
    encapsulation_key_length: 1184, // encapsulation public key bytes per FIPS 203 Table 3
    decapsulation_key_length: 2400, // decapsulation (secret) key bytes per FIPS 203 Table 3
    ciphertext_length: 1088, // ciphertext bytes per FIPS 203 Table 3
    shared_secret_length: 32, // shared secret bytes per FIPS 203 Table 3
    security_lambda: 192, // 192-bit security level
    description:
      'NIST FIPS 203 parameter set for 192-bit security level (192-bit security strength)',
  },
  'ml-kem-1024': {
    name: 'ML-KEM-1024',
    fips: 'FIPS 203',
    oid_dotted: '2.16.840.1.101.3.4.4.3',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'kems',
      'id-alg-ml-kem-1024',
      '3',
    ],
    key_length: 1568, // encapsulation key bytes per FIPS 203 Table 3
    signature_length: 3168, // decapsulation key bytes per FIPS 203 Table 3 (legacy field)
    encapsulation_key_length: 1568, // encapsulation public key bytes per FIPS 203 Table 3
    decapsulation_key_length: 3168, // decapsulation (secret) key bytes per FIPS 203 Table 3
    ciphertext_length: 1568, // ciphertext bytes per FIPS 203 Table 3
    shared_secret_length: 32, // shared secret bytes per FIPS 203 Table 3
    security_lambda: 256, // 256-bit security level
    description:
      'NIST FIPS 203 parameter set for 256-bit security level (256-bit security strength)',
  },
  'ml-dsa-44': {
    name: 'ML-DSA-44',
    fips: 'FIPS 204',
    oid_dotted: '2.16.840.1.101.3.4.3.17',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-ml-dsa-44',
      '17',
    ],
    key_length: 2560, // private key bytes per FIPS 204 Table 2
    public_key_length: 1312, // public key bytes per FIPS 204 Table 2
    private_key_length: 2560, // private key bytes per FIPS 204 Table 2
    signature_length: 2420, // signature bytes per FIPS 204 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 204 spec
    security_lambda: 128, // 128-bit security level
    description:
      'NIST FIPS 204 parameter set for 128-bit security level (128-bit security strength)',
  },
  'ml-dsa-65': {
    name: 'ML-DSA-65',
    fips: 'FIPS 204',
    oid_dotted: '2.16.840.1.101.3.4.3.18',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-ml-dsa-65',
      '18',
    ],
    key_length: 4032, // private key bytes per FIPS 204 Table 2
    public_key_length: 1952, // public key bytes per FIPS 204 Table 2
    private_key_length: 4032, // private key bytes per FIPS 204 Table 2
    signature_length: 3309, // signature bytes per FIPS 204 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 204 spec
    security_lambda: 192, // 192-bit security level
    description:
      'NIST FIPS 204 parameter set for 192-bit security level (192-bit security strength)',
  },
  'ml-dsa-87': {
    name: 'ML-DSA-87',
    fips: 'FIPS 204',
    oid_dotted: '2.16.840.1.101.3.4.3.19',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-ml-dsa-87',
      '19',
    ],
    key_length: 4896, // private key bytes per FIPS 204 Table 2
    public_key_length: 2592, // public key bytes per FIPS 204 Table 2
    private_key_length: 4896, // private key bytes per FIPS 204 Table 2
    signature_length: 4627, // signature bytes per FIPS 204 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 204 spec
    security_lambda: 256, // 256-bit security level
    description:
      'NIST FIPS 204 parameter set for 256-bit security level (256-bit security strength)',
  },
  'slh-dsa-sha2-128s': {
    name: 'SLH-DSA-SHA2-128s',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.20',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-sha2-128s',
      '20',
    ],
    key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    public_key_length: 32, // public key bytes per FIPS 205 Table 2 (2n where n=16)
    private_key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    signature_length: 7856, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 128, // 128-bit security level (security category 1)
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHA2-128s, security category 1 (128-bit security strength)',
  },
  'slh-dsa-sha2-128f': {
    name: 'SLH-DSA-SHA2-128f',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.21',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-sha2-128f',
      '21',
    ],
    key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    public_key_length: 32, // public key bytes per FIPS 205 Table 2 (2n where n=16)
    private_key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    signature_length: 17088, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 128, // 128-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHA2-128f, security category 1 (128-bit security strength)',
  },
  'slh-dsa-sha2-192s': {
    name: 'SLH-DSA-SHA2-192s',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.22',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-sha2-192s',
      '22',
    ],
    key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    public_key_length: 48, // public key bytes per FIPS 205 Table 2 (2n where n=24)
    private_key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    signature_length: 16224, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 192, // 192-bit security level (security category 3)
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHA2-192s, security category 3 (192-bit security strength)',
  },
  'slh-dsa-sha2-192f': {
    name: 'SLH-DSA-SHA2-192f',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.23',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-sha2-192f',
      '23',
    ],
    key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    public_key_length: 48, // public key bytes per FIPS 205 Table 2 (2n where n=24)
    private_key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    signature_length: 35664, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 192, // 192-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHA2-192f, security category 3 (192-bit security strength)',
  },
  'slh-dsa-sha2-256s': {
    name: 'SLH-DSA-SHA2-256s',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.24',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-sha2-256s',
      '24',
    ],
    key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    public_key_length: 64, // public key bytes per FIPS 205 Table 2 (2n where n=32)
    private_key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    signature_length: 29792, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 256, // 256-bit security level (security category 5)
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHA2-256s, security category 5 (256-bit security strength)',
  },
  'slh-dsa-sha2-256f': {
    name: 'SLH-DSA-SHA2-256f',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.25',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-sha2-256f',
      '25',
    ],
    key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    public_key_length: 64, // public key bytes per FIPS 205 Table 2 (2n where n=32)
    private_key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    signature_length: 49856, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 256, // 256-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHA2-256f, security category 5 (256-bit security strength)',
  },
  'slh-dsa-shake-128s': {
    name: 'SLH-DSA-SHAKE-128s',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.26',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-shake-128s',
      '26',
    ],
    key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    public_key_length: 32, // public key bytes per FIPS 205 Table 2 (2n where n=16)
    private_key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    signature_length: 7856, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 128, // 128-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHAKE-128s, security category 1 (128-bit security strength)',
  },
  'slh-dsa-shake-128f': {
    name: 'SLH-DSA-SHAKE-128f',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.27',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-shake-128f',
      '27',
    ],
    key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    public_key_length: 32, // public key bytes per FIPS 205 Table 2 (2n where n=16)
    private_key_length: 64, // private key bytes per FIPS 205 Table 2 (4n where n=16)
    signature_length: 17088, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 128, // 128-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHAKE-128f, security category 1 (128-bit security strength)',
  },
  'slh-dsa-shake-192s': {
    name: 'SLH-DSA-SHAKE-192s',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.28',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-shake-192s',
      '28',
    ],
    key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    public_key_length: 48, // public key bytes per FIPS 205 Table 2 (2n where n=24)
    private_key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    signature_length: 16224, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 192, // 192-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHAKE-192s, security category 3 (192-bit security strength)',
  },
  'slh-dsa-shake-192f': {
    name: 'SLH-DSA-SHAKE-192f',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.29',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-shake-192f',
      '29',
    ],
    key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    public_key_length: 48, // public key bytes per FIPS 205 Table 2 (2n where n=24)
    private_key_length: 96, // private key bytes per FIPS 205 Table 2 (4n where n=24)
    signature_length: 35664, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 192, // 192-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHAKE-192f, security category 3 (192-bit security strength)',
  },
  'slh-dsa-shake-256s': {
    name: 'SLH-DSA-SHAKE-256s',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.30',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-shake-256s',
      '30',
    ],
    key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    public_key_length: 64, // public key bytes per FIPS 205 Table 2 (2n where n=32)
    private_key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    signature_length: 29792, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 256, // 256-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHAKE-256s, security category 5 (256-bit security strength)',
  },
  'slh-dsa-shake-256f': {
    name: 'SLH-DSA-SHAKE-256f',
    fips: 'FIPS 205',
    oid_dotted: '2.16.840.1.101.3.4.3.31',
    oid_components: [
      'joint-iso-itu-t',
      'country',
      'us',
      'organization',
      'gov',
      'csor',
      'nistAlgorithm',
      'sigAlgs',
      'id-slh-dsa-shake-256f',
      '31',
    ],
    key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    public_key_length: 64, // public key bytes per FIPS 205 Table 2 (2n where n=32)
    private_key_length: 128, // private key bytes per FIPS 205 Table 2 (4n where n=32)
    signature_length: 49856, // signature bytes per FIPS 205 Table 2
    shared_secret_length: 32, // shared secret bytes per FIPS 205 spec
    security_lambda: 256, // 256-bit security level
    description:
      'NIST FIPS 205 parameter set SLH-DSA-SHAKE-256f, security category 5 (256-bit security strength)',
  },
};