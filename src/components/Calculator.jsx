"use client";
import { useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en-US"); // Default: English

  const handleClick = (value) => {
    if (value === "=") {
      try {
        setInput(eval(input).toString());
      } catch {
        setInput("Error");
      }
    } else if (value === "C") {
      setInput("");
    } else if (value === "⌫") {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value + "\n");
    }
  };

  // Voice Input Function
  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript.toLowerCase();
      transcript = transcript.replace(/।/g, ".");

      // Convert words to mathematical symbols
      const conversions = {
        "plus": "+", "जोड़": "+", "add": "+", 
        "minus": "-", "घटाओ": "-", "subtract": "-", 
        "times": "*", "गुणा": "*", "multiply": "*", "into": "*", "multiplied by" : "*",
        "divided by": "/", "divide": "/", "भाग": "/", "by": "/",
        "open bracket": "(", "खोलो ब्रैकेट": "(", 
        "close bracket": ")", "बंद ब्रैकेट": ")",
        "clear": "C", "साफ": "C", "साफ करो": "C",
        "delete": "⌫", "हटाओ": "⌫", 
        "equals": "=", "बराबर": "=", 
        "point": ".", "डॉट": ".", "decimal": "."
      };

      const numberMap = {
        "one": "1", "two": "2", "three": "3", "four": "4",
        "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9", "zero": "0",
        "एक": "1", "दो": "2", "तीन": "3", "चार": "4",
        "पांच": "5", "छह": "6", "सात": "7", "आठ": "8", "नौ": "9", "शून्य": "0"
      };

      Object.keys(conversions).forEach((word) => {
        transcript = transcript.replace(new RegExp(`\\b${word}\\b`, "g"), conversions[word]);
      });

      Object.keys(numberMap).forEach((numWord) => {
        transcript = transcript.replace(new RegExp(`\\b${numWord}\\b`, "g"), numberMap[numWord]);
      });

      setInput(input + transcript + "\n"); 
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-80 relative">
        <h1 className="text-white text-2xl font-bold text-center mb-4">Calculator</h1>  
        {/* 🌍 Language Toggle Button Styled as a Switch */}
        <div className="absolute top-2 right-2 flex items-center">
          <button
            onClick={() => setLanguage(language === "en-US" ? "hi-IN" : "en-US")}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${language === "en-US" ? "bg-gray-700" : "bg-yellow-500"}`}
          >
            <div className={`w-8 h-7 bg-white rounded-full flex items-center justify-center transition-transform ${language === "en-US" ? "translate-x-0" : "translate-x-6"}`}>
              {language === "en-US" ? "ENG" : "HIN"}
            </div>
          </button>
        </div>
        <textarea
          value={input}
          className="w-full p-3 text-xl text-right bg-gray-900 text-white rounded-lg mb-4 focus:outline-none"
          placeholder="0"
          readOnly
          rows="4"
        />
        <div className="grid grid-cols-4 gap-2">
          {["C", "(", ")", "⌫", "7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map(
            (val) => (
              <button
                key={val}
                onClick={() => handleClick(val)}
                className={`text-white font-bold text-lg py-3 rounded-lg shadow-md transition ${val === "="
                  ? "bg-green-500 hover:bg-green-600"
                  : val === "C" || val === "⌫"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                {val}
              </button>
            )
          )}
        </div>

        {/* 🎤 Start Voice Input Button */}
        <button
          onClick={startVoiceInput}
          className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg shadow-md transition"
        >
          🎤 Start Voice Input ({language === "en-US" ? "English" : "Hindi"})
        </button>
      </div>
    </div>
  );
}
