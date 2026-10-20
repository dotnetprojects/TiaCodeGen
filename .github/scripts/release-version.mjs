import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Use the common npm/NuGet version format. NuGet drops build metadata, so reject it.
export function releaseVersion(tag, prerelease = false) {
  const version = tag.replace(/^v/, '');
  const number = '(0|[1-9][0-9]*)';
  const identifier = '(?:0|[1-9][0-9]*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)';
  const pattern = new RegExp(`^${number}\\.${number}\\.${number}(?:-${identifier}(?:\\.${identifier})*)?$`);
  if (pattern.exec(version)?.[0] !== version) {
    throw new Error('Release tag must be MAJOR.MINOR.PATCH or vMAJOR.MINOR.PATCH, optionally with a SemVer prerelease suffix, without build metadata.');
  }
  if (prerelease && !version.includes('-')) {
    throw new Error('A GitHub prerelease must have a prerelease version suffix, for example v3.0.0-rc.1.');
  }
  return { version, npmTag: version.includes('-') ? 'next' : 'latest' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = releaseVersion(process.env.RELEASE_TAG ?? '', process.env.RELEASE_PRERELEASE === 'true');
  const output = `version=${result.version}\nnpm_tag=${result.npmTag}\n`;
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, output);
  process.stdout.write(output);
}
