import { parse_oid, validate_oid, get_oid_by_algorithm, validate_parameter_sizes, algorithms } from '../src/index.ts';

const args = process.argv.slice(2);
const cmd = args[0];

function usage() {
  console.log('Usage: pqc-registry <command> [args]');
  console.log('Commands:');
  console.log('  parse <oid>                    Parse an OID and return algorithm metadata (JSON)');
  console.log('  validate-oid <oid>             Check if OID is registered');
  console.log('  lookup <algorithm>             Get OID for algorithm name');
  console.log('  validate-sizes <algo> --<field> <N> ...');
  console.log('  list                           List all registered algorithms');
  console.log('  list --level <N>               List algorithms at or below security level N');
  console.log('  help                           Show this help');
}

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  usage();
  process.exit(cmd ? 0 : 1);
}

switch (cmd) {
  case 'parse': {
    const oid = args[1];
    if (!oid) fail('OID required');
    try {
      console.log(JSON.stringify(parse_oid(oid), null, 2));
    } catch (e) {
      fail(e.message);
    }
    break;
  }
  case 'validate-oid': {
    const oid = args[1];
    if (!oid) fail('OID required');
    console.log(validate_oid(oid) ? '✓ Valid OID' : '✗ Invalid OID');
    break;
  }
  case 'lookup': {
    const algorithm = args[1];
    if (!algorithm) fail('Algorithm name required');
    try {
      console.log(get_oid_by_algorithm(algorithm));
    } catch (e) {
      fail(e.message);
    }
    break;
  }
  case 'validate-sizes': {
    const algorithm = args[1];
    if (!algorithm) fail('Algorithm name required');
    const sizes = {};
    for (let i = 2; i < args.length; i += 2) {
      const flag = args[i];
      const val = args[i + 1];
      if (!flag || !flag.startsWith('--')) fail(`Expected --field value pair, got: ${flag}`);
      if (val === undefined || !/^\d+$/.test(val)) fail(`Expected numeric value for ${flag}, got: ${val}`);
      let field = flag.slice(2); // Remove leading '--'
      if (algorithm.startsWith('ml-kem-')) {
        if (flag === '--public-key') field = 'encapsulation_key';
        else if (flag === '--secret-key') field = 'decapsulation_key';
      }
      if (flag === '--ciphertext') field = 'ciphertext';
      if (flag === '--shared-secret') field = 'shared_secret';
      if (field === flag.slice(2)) {
        field = flag.slice(2).replace(/-([a-z])/g, (_, c) => '_' + c);
      }
      sizes[field] = Number(val);
    }
    // Auto-fill shared_secret for ML-KEM when not provided (all ML-KEM variants use 32 bytes)
    if (algorithm.startsWith('ml-kem-') && sizes.shared_secret === undefined) {
      sizes.shared_secret = 32;
    }
    try {
      const result = validate_parameter_sizes(algorithm, sizes);
      if (result.valid) {
        console.log('✓ Sizes are valid');
      } else {
        console.error('✗ Invalid sizes:');
        for (const err of result.errors) console.error(`  - ${err}`);
        process.exit(1);
      }
    } catch (e) {
      fail(e.message);
    }
    break;
  }
  case 'list': {
    if (args[1] === '--level') {
      const level = Number(args[2]);
      if (!Number.isFinite(level)) fail('Level number required for --level');
      const filtered = Object.entries(algorithms)
        .filter(([, spec]) => spec.security_lambda <= level)
        .map(([name]) => name);
      console.log(filtered.join('\n'));
    } else {
      console.log(Object.keys(algorithms).join('\n'));
    }
    break;
  }
  default:
    fail(`Unknown command: ${cmd}`);
}
