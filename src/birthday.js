import React, { useRef, useState } from "react";
import "./styles.scss";

const UseFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    console.log("mnyfocusususu");
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

export default function Birthday({ state, setState }) {
  const today = new Date();
  const currentYear = new Date().getFullYear();
  const currentYearShort = parseInt(currentYear.toString().substr(-2), 10);
  // const minAge = currentYear - 18;
  const maxAge = currentYear - 100;
  const minYearShort = parseInt(maxAge.toString().substr(-2), 10);
  const lastCentury = parseInt(maxAge.toString().substr(0, 2), 10);
  const nextYear = currentYear + 1;
  const [errorMsg, setErrorMsg] = useState("");
  const [inputDay, setinputDay] = UseFocus();
  const [inputMonth, setinputMonth] = UseFocus();
  const [inputYear, setinputYear] = UseFocus();

  const maxLengthCheck = e => {
    const maxLength = parseInt(e.target.getAttribute("data-maxlength"), 10);
    setErrorMsg("");
    if (e.target.value.length > maxLength) {
      console.log("sliiiiiice");
      e.target.value = e.target.value.slice(0, maxLength);
    }
    if (
      e.target.value.length === 4 &&
      parseInt(e.target.value, 10) <= currentYear - 100
    ) {
      console.log("etwas hier");
      e.target.value = "";
      setErrorMsg("Sie sind zu alt!");
    }
  };
  const handleChangeDays = e => {
    const intValue = parseInt(e.target.value, 10);
    if (parseInt(e.target.value, 10) > 31) {
      console.log("hiiiiiier");
      e.target.value = "";
      setErrorMsg("Kein Gültiger tag!");
    }
    if (intValue > 3 && intValue <= 9 && e.target.value.length <= 1) {
      e.target.value = 0 + e.target.value;
      setinputMonth();
    }
    if (e.target.value.length === 2) {
      setinputMonth();
    }
  };

  const handleChangeMonth = e => {
    const intValue = parseInt(e.target.value, 10);
    if (intValue > 12) {
      console.log("etwas hier");
      e.target.value = "";
      setErrorMsg("Kein Gültiger Monat!");
    }
    if (intValue >= 2 && intValue <= 9 && e.target.value.length <= 1) {
      e.target.value = 0 + e.target.value;
      setinputYear();
    }
    if (e.target.value.length === 2) {
      setinputYear();
    }
  };

  const handleChangeYear = e => {
    const intValue = parseInt(e.target.value, 10);
    if (intValue >= nextYear) {
      console.log("etwas hier");
      e.target.value = "";
      setErrorMsg("Geburtsjahr darf nicht in der Zukunft liegen.");
    }
    if (
      e.target.value.length === 2 &&
      intValue > minYearShort &&
      intValue > currentYearShort
    ) {
      e.target.value = lastCentury + e.target.value;
    }
  };
  const handleBirthdayComplete = e => {
    if (
      inputDay.current.value.length === 2 &&
      inputMonth.current.value.length === 2 &&
      inputYear.current.value.length === 4
    ) {
      const birthday = new Date(
        inputYear.current.value,
        inputMonth.current.value - 1,
        inputDay.current.value,
        0,
        0,
        0,
        0
      );
      if (birthday > today) {
        setErrorMsg("Zukunfts Kind blyat!");
      }
    }
  };
  const handleEmptyInput = e => {
    handleBirthdayComplete();
    console.log(e.target.value.length === 0);
    if (e.target.value.length === 0 && e.keyCode === 8) {
      if (e.target.className === "bdayMonth") {
        console.log("bin jhier");
        inputDay.current.value = inputDay.current.value.slice(0, -1);
        setinputDay();
      }
      if (e.target.className === "bdayYear") {
        setinputMonth();
        inputMonth.current.value = inputMonth.current.value.slice(0, -1);
      }
    }
  };

  return (
    <div className="App">
      <h1>Happy Birthday!</h1>
      <div className="testWrapper">
        <input
          className="bdayDay"
          type="number"
          placeholder="TT"
          data-maxlength={2}
          min="1"
          max="31"
          onInput={maxLengthCheck}
          onChange={handleChangeDays}
          ref={inputDay}
          pattern="[0-9]*"
        />
        <span>.</span>
        <input
          className="bdayMonth"
          type="number"
          lang="de"
          placeholder="MM"
          data-maxlength={2}
          min="1"
          max="12"
          ref={inputMonth}
          onInput={maxLengthCheck}
          onChange={handleChangeMonth}
          onKeyUp={handleEmptyInput}
          pattern="[0-9]*"
        />
        <span>.</span>
        <input
          className="bdayYear"
          type="number"
          lang="de"
          data-maxlength={4}
          placeholder="JJJJ"
          ref={inputYear}
          onInput={maxLengthCheck}
          onChange={handleChangeYear}
          onKeyUp={handleEmptyInput}
          pattern="[0-9]*"
        />
      </div>
      <p>{errorMsg}</p>
    </div>
  );
}
