import React, { useState, Fragment } from 'react';
import './styles.scss';

import {
  UseFocus,
  isValidDate,
} from './helpers';

import {
  today,
  currentYear,
  currentYearShort,
  minYearShort,
  lastCentury,
  MAX_PASSENGER_AGE,
} from './bday.config';

export default function Birthday({ state, setState }) {
  const [errorMsg, setErrorMsg] = useState('');
  // const [inputDay, setFocusToInputDay] = UseFocus();
  const [inputDayTest, setFocusToInputDay] = UseFocus();
  const [inputMonth, setFocusToInputMonth] = UseFocus();
  const [inputYear, setFocusToInputYear] = UseFocus();


  // set the order we want to show the input fields
  // this takes account of i18n (en is month/day/year)
  const displayOrder = ['day', 'month', 'year'];
  // count elements - we need this to conditional show the dot between elements
  // maybe its better to do this with css only? (hint: last-child:after)
  const elementsToShow = displayOrder.length;

  /**
   * emptys errorMsg, gets Input-Element Value, performs native Validation
   *
   * @param refElement - the ref-name of the Field
   * @returns {{valid: *, rangeOverflow: *, inputAsInteger: number}}
   */
  const getRefValueAndValidate = (refElement) => {
    setErrorMsg('');

    const inputLength = refElement.current.value.length;
    const inputAsInteger = parseInt(refElement.current.value, 10);
    // native form validation
    // https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
    refElement.current.checkValidity();

    const {
      current: {
        validity: {
          rangeOverflow,
          rangeUnderflow,
          valid,
        } = {},
      } = {},
    } = refElement;

    return {
      inputLength,
      inputAsInteger,
      rangeOverflow,
      rangeUnderflow,
      valid,
    };
  };

  const getNextElementToFocus = (currentElement) => {
    const len = displayOrder.length;
    const current = displayOrder.indexOf(currentElement);
    console.log('foo', len, current);
    if (len === current) return;
    const next = displayOrder[len];
  };
  /**
   * validate user input of Day
   */
  // eslint-disable-next-line consistent-return
  const handleChangeDays = () => {
    const {
      inputLength, inputAsInteger, rangeOverflow, valid,
    } = getRefValueAndValidate(inputDayTest);

    // validation says we are over the max value
    if (rangeOverflow) {
      inputDayTest.current.value = '';
      // i18n
      setErrorMsg('DAY_NOT_VALID');
    }

    // for ux-reason, set leading 0 to day if necessary
    if (
      valid
      && inputAsInteger > 3
      && inputAsInteger <= 9
      && inputLength <= 1
    ) {
      inputDayTest.current.value = `0${inputAsInteger}`;
      // we think everything is correct, set input-focus to month
      // return setFocusToInputMonth();
      inputMonth.current.focus();
    }

    // we think everything is correct, set input-focus to month
    if (
      inputAsInteger > 0
      && inputAsInteger < 32
      && inputLength === 2
    ) return inputMonth.current.focus();
  };

  /**
   * validate user input of Month
   */
  // eslint-disable-next-line consistent-return
  const handleChangeMonth = () => {
    const {
      inputLength, inputAsInteger, rangeOverflow, valid,
    } = getRefValueAndValidate(inputMonth);

    // native validation says we are over the max value
    if (rangeOverflow) {
      inputMonth.current.value = '';
      // i18n
      return setErrorMsg('MONTH_NOT_VALID');
    }

    // for ux-reason, set leading 0 to month if necessary
    if (
      valid
        && inputAsInteger >= 2
        && inputAsInteger <= 9
        && inputLength <= 1
    ) {
      inputMonth.current.value = `0${inputAsInteger}`;
      // we think everything is correct, set input-focus to month
      return setFocusToInputYear();
    }

    // we think everything is correct, set input-focus to month
    if (
      valid
        && inputLength === 2
    ) return setFocusToInputYear();
  };

  /**
   * validate user input of Year
   */
  // eslint-disable-next-line consistent-return
  const handleChangeYear = () => {
    const {
      inputLength, inputAsInteger, rangeOverflow, rangeUnderflow,
    } = getRefValueAndValidate(inputYear);

    // native validation says we are over the max value
    if (rangeOverflow) {
      inputYear.current.value = '';
      // i18n
      return setErrorMsg('YEAR_NOT_IN_FUTURE');
    }

    // validation says we are under the min value
    if (
      rangeUnderflow
      && inputLength === 4
    ) {
      inputYear.current.value = '';
      // i18n
      return setErrorMsg('TOO_OLD');
    }

    if (
      inputLength === 2
      && inputAsInteger > minYearShort
      && inputAsInteger > currentYearShort
    ) {
      inputYear.current.value = lastCentury + inputYear.current.value;
    }
  };

  /**
   * check we have a correct and valid birthday from the users input
   */
  // eslint-disable-next-line consistent-return
  const handleBirthdayComplete = () => {
    // TODO: maybe we must add optional chaining to babel ;)
    const day = inputDayTest?.current?.value || '';
    const month = inputMonth?.current?.value || '';
    const year = inputYear?.current?.value || '';

    if (!(
      day.length === 2
      && month.length === 2
      && year.length === 4
    )) return null;

    // Month are 0-indexed when used as an argument of Date
    const birthday = new Date(year, month - 1, day, 0, 0, 1);

    // ensure we have a valid date
    if (!isValidDate(birthday)) return setErrorMsg('DATE_INVALID');

    if (birthday > today) return setErrorMsg('Zukunfts Kind blyat!');
  };


  const handleEmptyInput = (e) => {
    handleBirthdayComplete();

    // check for backspace-key and length of the input value
    if (!(
      e.target.value.length === 0
      && e.keyCode === 8
    )) return;

    if (e.target.className === 'bdayMonth') {
      // inputMonth.current.value = inputMonth.current.value.slice(0, -1);
      setFocusToInputDay();
    }
    if (e.target.className === 'bdayYear') {
      setFocusToInputMonth();
      // inputMonth.current.value = inputMonth.current.value.slice(0, -1);
    }
  };

  // define the Attributes for the input Fields
  const inputFieldSettings = {
    day: {
      className: 'bdayDay',
      placeholder: 'TT',
      min: 1,
      max: 31,
      onChange: handleChangeDays,
      onKeyUp: () => {
      },
      ref: inputDayTest,
    },
    month: {
      className: 'bdayMonth',
      placeholder: 'MM',
      min: 1,
      max: 12,
      onChange: handleChangeMonth,
      onKeyUp: handleEmptyInput,
      ref: inputMonth,
    },
    year: {
      className: 'bdayYear',
      placeholder: 'JJJJ',
      min: currentYear - MAX_PASSENGER_AGE,
      max: currentYear,
      onChange: handleChangeYear,
      onKeyUp: handleEmptyInput,
      ref: inputYear,
    },
  };

  /**
   * shows conditionally a DOT between elements
   *
   * e.g. ele1 DOT ele2 DOT ele3
   *
   * @param currentIndex - the index of the current element
   * @returns {null|*}
   * @constructor
   */
  const ShowDot = (currentIndex) => {
    if (currentIndex + 1 < elementsToShow) return (<span>.</span>);
    return null;
  };

  /**
   * renders a single input field with given settings
   *
   * @param elementAttributeSettings - the settings for the element
   * @returns {*}
   * @constructor
   */
  const InputField = (elementAttributeSettings) => (
    <input
      className={elementAttributeSettings.className}
      type="number"
      placeholder={elementAttributeSettings.placeholder}
      min={elementAttributeSettings.min}
      max={elementAttributeSettings.max}
      step="1"
      onChange={elementAttributeSettings.onChange}
      onKeyUp={elementAttributeSettings.onKeyUp}
      ref={elementAttributeSettings.ref}
    />
  );

  /**
   * render all the input fields
   */
  const renderFields = (
    <>
      {displayOrder.map((order, currentIndex) => {
        const elementAttributeSettings = inputFieldSettings[order];
        return (
          <Fragment key={elementAttributeSettings.className}>
            { InputField(elementAttributeSettings) }
            { ShowDot(currentIndex)}
          </Fragment>
        );
      })}
      <p>{errorMsg}</p>
    </>
  );

  return renderFields;
}
