# Cryptographic Test Vector Sources

All golden test vectors in this directory originate from official standards bodies and specifications:

1. **ML-KEM Vectors (`golden_vectors_mlkem.json`)**:
   - Standard: NIST FIPS 203 (Module-Lattice-Based Key-Encapsulation Mechanism Standard), Table 3.
   - Parameters: ML-KEM-512, ML-KEM-768, ML-KEM-1024.
   - Purpose: Verifying encapsulation key, decapsulation key, and ciphertext lengths.

2. **ML-DSA Vectors (`golden_vectors_ml_dsa.json`)**:
   - Standard: NIST FIPS 204 (Module-Lattice-Based Digital Signature Standard), Table 2.
   - Parameters: ML-DSA-44, ML-DSA-65, ML-DSA-87.
   - Purpose: Verifying public key, private key, and signature byte lengths.

3. **SLH-DSA Vectors (`golden_vectors_slhdsa.json`)**:
   - Standard: NIST FIPS 205 (Stateless Hash-Based Digital Signature Standard), Table 2.
   - Parameters: All 12 SLH-DSA parameter sets across SHA-2 and SHAKE.
   - Purpose: Verifying public key, private key, and signature wire lengths.
