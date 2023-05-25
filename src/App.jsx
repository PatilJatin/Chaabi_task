import { useState, useEffect } from "react";
import useKeyPress from "./hooks/useKeyPress";
import { generate } from "./utils/words";
import { currentTime } from "./utils/time";

import "./App.css";

const initialWords = generate();

function App() {
  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(" ").join("")
  );
  const [outgoingChars, setOutgoingChars] = useState("");
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initialWords.substr(1));

  const [startTime, setStartTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);

  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState("");
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [restartPractice, setRestartPractice] = useState(false);

  useKeyPress((key) => {
    if (!startTime) {
      setStartTime(currentTime());
    }

    if (key === "Escape") {
      // Handle 'Escape' key press to restart the practice
      setRestartPractice(true);
      return;
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    if (key === currentChar) {
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }
      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      setCurrentChar(incomingChars.charAt(0));

      updatedIncomingChars = incomingChars.substring(1);
      if (updatedIncomingChars.split(" ").length < 10) {
        updatedIncomingChars += " " + generate();
      }
      setIncomingChars(updatedIncomingChars);

      if (incomingChars.charAt(0) === " ") {
        setWordCount(wordCount + 1);
        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }
    }

    const updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);
    setAccuracy(
      ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(
        2
      )
    );
    setKeyPressCount(keyPressCount + 1);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTimeInMinutes = (currentTime() - startTime) / 60000.0;
      if (currentTimeInMinutes >= 5) {
        clearInterval(timer);
        const keysPerMinute = Math.round(keyPressCount / currentTimeInMinutes);
        console.log("Keys per minute:", keysPerMinute);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [startTime, keyPressCount]);

  useEffect(() => {
    if (restartPractice) {
      setLeftPadding(new Array(20).fill(" ").join(""));
      setOutgoingChars("");
      setCurrentChar(initialWords.charAt(0));
      setIncomingChars(initialWords.substr(1));

      setStartTime(0);
      setWordCount(0);
      setWpm(0);
      setAccuracy(0);

      setTypedChars("");
      setKeyPressCount(0);
      setRestartPractice(false);
    }
  }, [restartPractice, initialWords]);

  return (
    <div className="App">
      <p className="Esc">Press Esc | to start again</p>
      <h1 className="heading">#Touch typing </h1>
      <section className="App-section">
        <p className="Character">
          <span className="Character-out">
            {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span className="Character-current">{currentChar}</span>
          <span>{incomingChars.substr(0, 20)}</span>
        </p>
        <h3 className="results">
          WPM: {wpm} | ACC: {accuracy}%
        </h3>
        <h3 className="results">Total Keys Pressed: {keyPressCount}</h3>
      </section>
    </div>
  );
}

export default App;
