import React, {
  useState, Fragment,
} from 'react';
import './styles.scss';

import {
  isValidDate,
  setFocusToNextElement,
  setFocusToPrevElement,
} from './helpers';

import {
  today,
  currentYearShort,
  minYearShort,
  lastCentury,
  inputFieldSettings,
} from './bday.config';

export default function Birthday({ state, setState }) {
  const [errorMsg, setErrorMsg] = useState('');

  // set the order we want to show the input fields
  // this takes account of i18n (en is month/day/year)
  const displayOrder = ['day', 'month', 'year'];
  // count elements - we need this to conditional show the dot between elements
  // maybe its better to do this with css only? (hint: last-child:after)
  const elementsToShow = displayOrder.length;

  /**
   * emptys errorMsg, gets Input-Element Value, performs native Validation
   *
   * @param {object} refElement - the ref-name of the Field
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

  /**
   * validate user input of Day
   *
   * @param {object} ref - ref of current element
   */
  // eslint-disable-next-line consistent-return
  const handleChangeDays = (ref) => {
    const {
      inputLength, inputAsInteger, rangeOverflow, valid,
    } = getRefValueAndValidate(ref);

    // validation says we are over the max value
    if (rangeOverflow) {
      // eslint-disable-next-line no-param-reassign
      ref.current.value = '';
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
      // eslint-disable-next-line no-param-reassign
      ref.current.value = `0${inputAsInteger}`;
      // we think everything is correct, set input-focus to month
      return setFocusToNextElement('day', displayOrder, inputFieldSettings);
    }

    // we think everything is correct, set input-focus to month
    if (
      inputAsInteger > 0
      && inputAsInteger < 32
      && inputLength === 2
    ) return setFocusToNextElement('day', displayOrder, inputFieldSettings);
  };

  /**
   * validate user input of Month
   *
   * @param {object} ref - ref of current element
   */
  // eslint-disable-next-line consistent-return
  const handleChangeMonths = (ref) => {
    const {
      inputLength, inputAsInteger, rangeOverflow, valid,
    } = getRefValueAndValidate(ref);

    // native validation says we are over the max value
    if (rangeOverflow) {
      // eslint-disable-next-line no-param-reassign
      ref.current.value = '';
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
      // eslint-disable-next-line no-param-reassign
      ref.current.value = `0${inputAsInteger}`;
      // we think everything is correct, set input-focus to month
      return setFocusToNextElement('month', displayOrder, inputFieldSettings);
    }

    // we think everything is correct, set input-focus to month
    if (
      valid
      && inputLength === 2
    ) return setFocusToNextElement('month', displayOrder, inputFieldSettings);
  };

  /**
   * validate user input of Year
   *
   * @param {object} ref - ref of current element
   */
  // eslint-disable-next-line consistent-return
  const handleChangeYears = (ref) => {
    const {
      inputLength, inputAsInteger, rangeOverflow, rangeUnderflow,
    } = getRefValueAndValidate(ref);

    // native validation says we are over the max value
    if (rangeOverflow) {
      // eslint-disable-next-line no-param-reassign
      ref.current.value = '';
      // i18n
      return setErrorMsg('YEAR_NOT_IN_FUTURE');
    }

    // validation says we are under the min value
    if (
      rangeUnderflow
      && inputLength === 4
    ) {
      // eslint-disable-next-line no-param-reassign
      ref.current.value = '';
      // i18n
      return setErrorMsg('TOO_OLD');
    }

    if (
      inputLength === 2
      && inputAsInteger > minYearShort
      && inputAsInteger > currentYearShort
    ) {
      // eslint-disable-next-line no-param-reassign
      ref.current.value = lastCentury + ref.current.value;
    }
  };

  /**
   * check we have a correct and valid birthday from the users input
   */
  // eslint-disable-next-line consistent-return
  const handleBirthdayComplete = () => {
    // TODO: maybe we must add optional chaining to babel ;)
    const day = inputFieldSettings.day.ref?.current?.value || '';
    const month = inputFieldSettings.month.ref?.current?.value || '';
    const year = inputFieldSettings.year.ref?.current?.value || '';

    if (!(
      day.length === 2
      && month.length === 2
      && year.length === 4
    )) return null;

    // create Date from User Input
    // Month are 0-indexed when used as an argument of Date
    const birthday = new Date(year, month - 1, day, 0, 0, 1);

    // ensure we have a valid date
    if (!isValidDate(birthday)) return setErrorMsg('DATE_INVALID');

    if (birthday > today) return setErrorMsg('Zukunfts Kind blyat!');
  };

  /**
   * handles backspace key when input-field is already empty
   *
   * sets the focus to the previous element
   * takes displayOrder in account
   *
   * @event e
   */
  const handleEmptyInput = (e) => {
    // check for backspace-key and length of the input value
    if (!(
      e.target.value.length === 0
      && e.keyCode === 8
    )) return;

    // TODO: maybe we must add optional chaining to babel ;)
    const classname = e.target?.className;
    let currentElement = '';
    if (classname === 'bdayDay') currentElement = 'day';
    if (classname === 'bdayMonth') currentElement = 'month';
    if (classname === 'bdayYear') currentElement = 'year';
    setFocusToPrevElement(currentElement, displayOrder, inputFieldSettings);
  };

  /**
   * handle input changes for day, month, year
   *
   * since every element needs its own validation, we decide here which validation
   * we use
   */
  const handleChanges = {
    day: () => handleChangeDays(inputFieldSettings.day.ref),
    month: () => handleChangeMonths(inputFieldSettings.month.ref),
    year: () => handleChangeYears(inputFieldSettings.year.ref),
  };

  /**
   *
   * @event e - event
   * @param {array} cb - array with strings of functions we want to call
   */
  const handleKeyUp = (e, cb) => {
    if (cb.includes('handleEmptyInput')) handleEmptyInput(e);
    if (cb.includes('handleBirthdayComplete')) handleBirthdayComplete();
  };

  /**
   * shows conditionally a DOT between elements
   *
   * e.g. ele1 DOT ele2 DOT ele3
   *
   * maybe ist better to do this with pure CSS
   *
   * @param {number} currentIndex - the index of the current element
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
   * @param {object} elementAttributeSettings - the settings for the element
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
      onChange={() => { handleChanges[elementAttributeSettings.onChange](); }}
      onKeyUp={(e) => { handleKeyUp(e, elementAttributeSettings.onKeyUp); }}
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
