import React, { useState } from "react";

const GutterCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleButtonClick = (value: any) => {
    setInput((prev) => prev + value);
  };

  const handleResult = () => {
    try {
      setResult(eval(input).toString());
    } catch (error) {
      setResult("Error");
    }
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  return (
    <div
      style={{
        display: "inline-block",
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div>
        <input
          type="text"
          value={input}
          readOnly
          style={{ width: "180px", marginBottom: "10px" }}
        />
      </div>
      <div>
        <input
          type="text"
          value={result}
          readOnly
          style={{ width: "180px", marginBottom: "10px", color: "green" }}
        />
      </div>
      {[1, 2, 3, "+", 4, 5, 6, "-", 7, 8, 9, "*", 0, ".", "=", "/"].map(
        (button, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (button === "=") handleResult();
              else handleButtonClick(button.toString());
            }}
            style={{ width: "40px", height: "40px", margin: "5px" }}
          >
            {button}
          </button>
        )
      )}
      <button onClick={handleClear} style={{ width: "90%", marginTop: "10px" }}>
        Clear
      </button>
    </div>
  );
};

export default GutterCalculator;
