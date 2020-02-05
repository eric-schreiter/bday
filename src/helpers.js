import { useRef } from 'react';

const UseFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    console.log('mnyfocusususu');
    if (!htmlElRef.current) return;
    const len = htmlElRef.current.value.toString().length;
    const { current: { type } } = htmlElRef;
    htmlElRef.current.type = 'text';
    htmlElRef.current.focus();
    htmlElRef.current.setSelectionRange(len, len);
    htmlElRef.current.type = type;
    console.log(htmlElRef.current, len);
  };
  return [htmlElRef, setFocus];
};

const useFo = (elementToFocus) => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    console.log('mnyfocusususu');
    if (!htmlElRef.current) return;
    const len = htmlElRef.current.value.toString().length;
    const { current: { type } } = htmlElRef;
    htmlElRef.current.type = 'text';
    htmlElRef.current.focus();
    htmlElRef.current.setSelectionRange(len, len);
    htmlElRef.current.type = type;
    console.log(htmlElRef.current, len);
  };
  return [htmlElRef, setFocus];
};

const isValidDate = (date) => date instanceof Date && !Number.isNaN(date);

export { UseFocus, useFo, isValidDate };
