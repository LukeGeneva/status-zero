const moment = require('moment');
const { getPreviousWorkday } = require( './calendar')

test('can get previous workday', () => {
  const tuesday = new Date([2020, 2, 25]);
  const previousWorkday = getPreviousWorkday(tuesday);
  const monday = new Date([2020, 2, 24]);
  expect(previousWorkday).toEqual(monday);
});

test('can get previous workday from a Monday', () => {
  const monday = new Date([2020, 2, 24]);
  const previousWorkday = getPreviousWorkday(monday);
  const friday = new Date([2020, 2, 21]);
  expect(previousWorkday).toEqual(friday);
});
