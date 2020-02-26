const moment = require('moment');

const MONDAY = 1;

function getPreviousWorkday(workdate) {
  const date = moment(workdate);
  const isMonday = date.day() === MONDAY;
  const daysSinceLastWorkday = isMonday ? 3 : 1;
  return date.subtract(daysSinceLastWorkday, 'day').toDate();
}

module.exports = { getPreviousWorkday };
