import { getYear, addYears } from 'date-fns';

const MAX_PASSENGER_AGE = 100;

const today = new Date();
const currentYear = getYear(today);
const nextYear = getYear(addYears(today, 1));
const maxPassengerAge = currentYear - MAX_PASSENGER_AGE;

const currentYearShort = parseInt(currentYear.toString().substr(-2), 10);
const minYearShort = parseInt(maxPassengerAge.toString().substr(-2), 10);

const lastCentury = parseInt(maxPassengerAge.toString().substr(0, 2), 10);

export {
  today,
  currentYear,
  currentYearShort,
  maxPassengerAge,
  minYearShort,
  lastCentury,
  nextYear,
  MAX_PASSENGER_AGE,
};
