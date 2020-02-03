const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cwd = process.cwd();
const path = require('path');

function getWorkingDirectoryNpmPackageInfo() {
  return require(path.resolve(cwd, 'package.json'));
}

(async () => {
  try {
    const { name, version } = getWorkingDirectoryNpmPackageInfo();
    const response = await exec(`npm view ${name} versions --json`);
    const { stdout } = response;
    if (stdout) {
      const versions = JSON.parse(stdout);
      const isVersionExist = versions.includes(version);
      process.exit(isVersionExist ? 1 : 0);
    }
    process.exit(1);
  } catch (e) {
    const { stderr } = e;
    if (stderr) {
      if (stderr.indexOf('GET 404') > -1) {
        console.log('[npm-version-process]: 暂未在 npm 仓库中发现相关 package');
        process.exit(0);
      } else {
        console.log(stderr);
      }
    }
    process.exit(1);
  }
})();
