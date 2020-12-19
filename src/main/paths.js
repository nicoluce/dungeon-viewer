
const pkg = require('../../package.json');
const path = require('path');
const os = require('os');

export function getAppDataPath(platform) {
  switch(platform) {
    case 'win32': return process.env[`${pkg['short-name']}_APPDATA`] || process.env['APPDATA'] || path.join(process.env['USERPROFILE'], 'AppData', 'Roaming');
    case 'darwin': return process.env[`${pkg['short-name']}_APPDATA`] || path.join(os.homedir(), 'Library', 'Application Support');
    case 'linux': return process.env[`${pkg['short-name']}_APPDATA`] || process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config');
    default: throw new Error(`Platform '${platform}' not supported`);
  }
}

export function getDefaultUserDataPath(platform) {
  return path.join(getAppDataPath(platform), pkg.name);
} 
