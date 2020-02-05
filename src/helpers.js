/**
 * sets the focus to next element
 *
 * takes the position of current element in array, gets the next element from array
 * and sets focus to the matching element from objectOfElements
 *
 * @param {string} currentElement - the element we are current
 * @param {array} arrayOfElements - list of elements to lookup
 * @param {object} objectOfElements - to find the previous ref
 * */
const setFocusToNextElement = (currentElement, arrayOfElements, objectOfElements) => {
  const len = arrayOfElements.length;
  const current = arrayOfElements.indexOf(currentElement);
  // are we already on the last element?
  if (len === current + 1) return;
  const next = arrayOfElements[current + 1];
  const nextRef = objectOfElements[next].ref;
  nextRef.current.focus();
};

/**
 * sets the focus to previous element
 *
 * takes the position of current element in array, gets the previous element from array
 * and sets focus to the mathcing element from objectOfElements
 *
 * @param {string} currentElement - the element we are current
 * @param {array} arrayOfElements - list of elements to lookup
 * @param {object} objectOfElements - to find the previous ref
 */
const setFocusToPrevElement = (currentElement, arrayOfElements, objectOfElements) => {
  if (!currentElement) return;
  const current = arrayOfElements.indexOf(currentElement);
  // are we already on the first element?
  if (current === 0) return;
  const prev = arrayOfElements[current - 1];
  const prevRef = objectOfElements[prev].ref;
  prevRef.current.focus();
};

const isValidDate = (date) => date instanceof Date && !Number.isNaN(date);

export {
  setFocusToNextElement,
  setFocusToPrevElement,
  isValidDate,
};
