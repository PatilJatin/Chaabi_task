import { useState, useEffect } from "react";

const useKeyPress = (callback) => {
  const [keyPressed, setKeyPressed] = useState(null);

  useEffect(() => {
    const downHandler = (event) => {
      if (event.key === "Escape" || event.key === "Tab") {
        setKeyPressed(event.key);
        callback && callback(event.key);
      } else if (keyPressed !== event.key && event.key.length === 1) {
        setKeyPressed(event.key);
        callback && callback(event.key);
      }
    };

    const upHandler = () => {
      setKeyPressed(null);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [callback, keyPressed]);

  return keyPressed;
};

export default useKeyPress;
