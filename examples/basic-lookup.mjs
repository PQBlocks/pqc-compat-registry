import {
  get_oid_by_algorithm,
  validate_oid,
  parse_oid
} from '@pqblocks/pqc-compat-registry';

// Basic OID lookup and validation
const algo = 'ml-kem-768';
const oid = get_oid_by_algorithm(algo);
console.log('Lookup ml-kem-768:', oid);

if (oid !== '2.16.840.1.101.3.4.4.2') {
  throw new Error('Expected OID mismatch');
}

if (!validate_oid(oid)) {
  throw new Error('validate_oid should return true for valid OID');
}

const parsed = parse_oid(oid);
if (!parsed || parsed.algorithm !== algo) {
  throw new Error('parse_oid round-trip failed');
}

console.log('OK');
