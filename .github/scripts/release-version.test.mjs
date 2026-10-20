import assert from 'node:assert/strict';
import test from 'node:test';
import { releaseVersion } from './release-version.mjs';

test('stable tags share the same npm and NuGet version', () => {
  for (const tag of ['3.2.1', 'v3.2.1']) {
    assert.deepEqual(releaseVersion(tag), { version: '3.2.1', npmTag: 'latest' });
  }
});

test('prerelease tags never advance npm latest', () => {
  for (const prerelease of [true, false]) {
    assert.deepEqual(releaseVersion('v3.2.1-rc.1', prerelease), { version: '3.2.1-rc.1', npmTag: 'next' });
  }
  assert.equal(releaseVersion('1.0.0-0').version, '1.0.0-0');
});

test('rejects versions the registries would interpret differently or cannot accept', () => {
  for (const tag of ['', 'release-1.2.3', '1.2', '1.2.3.4', '01.2.3', '1.2.3-01', '1.2.3+build.1', '1.2.3-rc..1', '1.2.3\n', '1.2.3\nversion=4.0.0']) {
    assert.throws(() => releaseVersion(tag), /Release tag must/);
  }
  assert.throws(() => releaseVersion('v1.2.3', true), /prerelease version suffix/);
});
