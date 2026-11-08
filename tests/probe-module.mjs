// Sanity probe: confirms src/registry.ts exports resolve and are non-empty.
import { algorithms } from '../dist/registry.js';
console.log('entries:', Object.keys(algorithms).length);
console.log('with name:', Object.values(algorithms).filter((a) => a.name).length);
console.log('with oid_dotted:', Object.values(algorithms).filter((a) => a.oid_dotted).length);
console.log(
  'with oid_components:',
  Object.values(algorithms).filter((a) => a.oid_components && a.oid_components.length).length
);
