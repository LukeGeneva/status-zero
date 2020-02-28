const { exec } = require('child_process');
const moment = require('moment');

function fetchAllGitLogs({ day, author, directories }) {
  const workday = moment(day);
  const after = workday.format('YYYY-MM-DD');
  const before = workday.format('YYYY-MM-DD 23:59:59');
  // TODO: Use double quotes for args to handle names with apostrophes
  const promises = directories.map(dir => {
    const command = `cd ${dir} && git log --all --after='${after}' --before='${before}' --format='%s%n%b' --author='${author}'`;
    return new Promise((resolve, reject) => exec(command, {}, (error, stdout) => (error ? reject(error) : resolve(stdout))));
  });
  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(logs => resolve(logs.join('\n')))
      .catch(reject);
  });
}

module.exports = fetchAllGitLogs;
