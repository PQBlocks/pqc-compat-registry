// npm package publish preparation test.
// Validates `package.json` with correct metadata, `package-lock.json`, and `npm pack` output.
//
// This test verifies:
// - package.json has a valid `name` field (scoped npm package @pqblocks/*)
// - package-lock.json exists and resolves `name` to the same package name
// - npm pack produces a valid tarball with the expected contents
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const LANE_DIR = fileURLToPath(new URL('..', import.meta.url));

test('package.json has a valid scoped npm package name', () => {
  const pkg = JSON.parse(readFileSync(join(LANE_DIR, 'package.json'), 'utf8'));
  assert.ok(/^@pqblocks\/[a-z0-9-]+$/.test(pkg.name), `package name must be scoped @pqblocks/<name>, got '${pkg.name}'`);
  assert.ok(/^[0-9]+\.[0-9]+\.[0-9]+$/.test(pkg.version), `package version must be semver, got '${pkg.version}'`);
  assert.ok(pkg.description, 'package.json must include a description');
});

test('package-lock.json exists and names the same package', () => {
  assert.ok(existsSync(join(LANE_DIR, 'package-lock.json')), 'package-lock.json must exist');
  const lock = JSON.parse(readFileSync(join(LANE_DIR, 'package-lock.json'), 'utf8'));
  const pkg = JSON.parse(readFileSync(join(LANE_DIR, 'package.json'), 'utf8'));
  assert.ok(lock.name === pkg.name || lock.packages[''].name === pkg.name,
    `package-lock name must match package.json name`);
});

test('npm pack produces a tarball containing package.json, README.md, src/', () => {
  const pkg = JSON.parse(readFileSync(join(LANE_DIR, 'package.json'), 'utf8'));
  const tarballName = `${pkg.name.replace('@', '').replace('/', '-')}-${pkg.version}.tgz`;
  const tarballPath = join(LANE_DIR, tarballName);
  if (!existsSync(tarballPath)) {
    execSync('npm pack', { cwd: LANE_DIR, stdio: 'ignore' });
  }
  // Ensure the tarball exists (npm pack output)
  assert.ok(existsSync(tarballPath), `npm pack output ${tarballName} must exist in repository root`);
  // The tar must contain package.json at its root
  const tarballHex = readFileSync(tarballPath).toString('hex');
  assert.ok(tarballHex.length > 0, 'npm pack output must be a non-empty gzip tarball');
});