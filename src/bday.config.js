import { getYear, addYears } from 'date-fns';
import { createRef } from 'react';

const MAX_PASSENGER_AGE = 100;

const today = new Date();
const currentYear = getYear(today);
const nextYear = getYear(addYears(today, 1));
const maxPassengerAge = currentYear - MAX_PASSENGER_AGE;

const currentYearShort = parseInt(currentYear.toString().substr(-2), 10);
const minYearShort = parseInt(maxPassengerAge.toString().substr(-2), 10);

const lastCentury = parseInt(maxPassengerAge.toString().substr(0, 2), 10);

// define the Attributes for the input Fields
const inputFieldSettings = {
  day: {
    className: 'bdayDay',
    placeholder: 'TT',
    min: 1,
    max: 31,
    onChange: 'day',
    onKeyUp: ['handleEmptyInput', 'handleBirthdayComplete'],
    ref: createRef(),
  },
  month: {
    className: 'bdayMonth',
    placeholder: 'MM',
    min: 1,
    max: 12,
    onChange: 'month',
    onKeyUp: ['handleEmptyInput', 'handleBirthdayComplete'],
    ref: createRef(),
  },
  year: {
    className: 'bdayYear',
    placeholder: 'JJJJ',
    min: currentYear - MAX_PASSENGER_AGE,
    max: currentYear,
    onChange: 'year',
    onKeyUp: ['handleEmptyInput', 'handleBirthdayComplete'],
    ref: createRef(),
  },
};

export {
  today,
  currentYear,
  currentYearShort,
  maxPassengerAge,
  minYearShort,
  lastCentury,
  nextYear,
  MAX_PASSENGER_AGE,
  inputFieldSettings,
};
