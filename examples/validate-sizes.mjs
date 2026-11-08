import {
  validate_parameter_sizes,
  validate_slh_dsa_sizes
} from '@pqblocks/pqc-compat-registry';

// ML-DSA-65 sizes from FIPS 204 Table 2
const mldsa = validate_parameter_sizes('ml-dsa-65', {
  private_key: 4032,
  public_key: 1952,
  signature: 3309
});
console.log('ml-dsa-65 valid:', mldsa.valid);
if (!mldsa.valid) {
  throw new Error('ml-dsa-65 sizes should validate');
}

// SLH-DSA-SHA2-128s sizes from FIPS 205 Table 2
const slhdsa = validate_slh_dsa_sizes('slh-dsa-sha2-128s', {
  private_key: 64,
  public_key: 32,
  signature: 7856
});
console.log('slh-dsa-sha2-128s valid:', slhdsa.valid);
if (!slhdsa.valid) {
  throw new Error('slh-dsa-sha2-128s sizes should validate');
}

console.log('OK');
