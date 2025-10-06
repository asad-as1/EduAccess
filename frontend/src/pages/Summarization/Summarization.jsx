import React, { useState } from 'react';
import axios from 'axios';
import './Summarization.css';
import Cookies from "cookies-js"

function Summarization() {
  const [inputText, setInputText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("Summarize this text concisely while retaining maximum information.");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const token = Cookies.get('user')

  const calculateWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setWordCount(calculateWordCount(e.target.value));
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/summarize`, {
        text: inputText,
        prompt: customPrompt,
        token: token
      });
      
      if (response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setError("No summary could be generated");
      }
    } catch (error) {
      console.error("Error summarizing text:", error);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setInputText("");
    setSummary("");
    setError("");
    setWordCount(0);
    setCustomPrompt("Summarize this text concisely while retaining maximum information.");
  };

  return (
    <div className="text-summarizer-container">
      <div className="summarizer-wrapper">
        <div className="input-section">
          <div className="section-header">
            <h2>Input Text</h2>
            <span className="word-count">Words: {wordCount}</span>
          </div>
          <textarea
            className="input-textarea"
            value={inputText}
            onChange={handleTextChange}
            placeholder="Write or paste your text here..."
          />
          <div className="prompt-container">
            <label htmlFor="customPrompt">Customization Prompt:</label>
            <input
              id="customPrompt"
              type="text"
              className="prompt-input"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter custom prompt (optional)"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button 
              onClick={handleSummarize}
              disabled={isLoading}
              className="summarize-button"
            >
              {isLoading ? "Summarizing..." : "Summarize"}
            </button>
            <button 
              onClick={handleClearAll}
              className="clear-button"
              disabled={isLoading}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="summary-section">
          <h2>Summary</h2>
          <div className="summary-content">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Generating summary...</p>
              </div>
            ) : summary ? (
              <div className="summary-text">{summary}</div>
            ) : (
              <p className="placeholder-text">Your summary will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summarization;