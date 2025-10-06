import React, { useState } from "react";
import axios from "axios";
import "./TakeATest.css";
import Cookies from "cookies-js"

const TakeATest = () => {
  const [originalText, setOriginalText] = useState("");
  const [userText, setUserText] = useState("");
  const [similarityScore, setSimilarityScore] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [reasons, setReasons] = useState([]);
  const [isHidden, setIsHidden] = useState(false);
  const [error, setError] = useState(null);
  const [isChecking, setIsChecking] = useState(false); // New state for button text
  const token = Cookies.get('user')

  const checkSimilarity = async () => {
    try {
      setError(null);
      setIsChecking(true); // Show "Checking..." while waiting for response

      const response = await axios.post(`${import.meta.env.VITE_URL}/api/compare`, {
        reference_text: originalText,
        comparison_text: userText,
        token : token
      });

      const { similarity_score, analysis, reasons } = response.data;
      setSimilarityScore(similarity_score);
      setAnalysis(analysis);
      setReasons(reasons);
    } catch (error) {
      console.error("Error fetching similarity:", error);
      setError("Failed to fetch similarity score. Please try again.");
    } finally {
      setIsChecking(false); // Reset button text
    }
  };

  return (
    <div className="similarity-container">
      <h1 className="title">Text Similarity Checker</h1>
      <div className="panels-container">
        <div className="panel">
          <div className="panel-header">
            <h2>Original Text</h2>
            <button
              className={`hide-button ${isHidden ? "active" : ""}`}
              onClick={() => setIsHidden(!isHidden)}
            >
              {isHidden ? "Show" : "Hide"}
            </button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter original text here... On this side, paste the text from the sources (like books or notes) that you have learned."
            className={`text-input ${isHidden ? "hidden-text" : ""}`}
          />
        </div>

        <div className="panel">
          <h2>Your Text</h2>
          <textarea
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Enter your text here... On this side, write the content from your memory. Then, click the 'Text Similarity' button to check how accurate your recall is."
            className="text-input"
          />
        </div>
      </div>

      <div className="button-container">
        <button onClick={checkSimilarity} className="check-button" disabled={isChecking}>
          {isChecking ? "Checking..." : "Check Similarity"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {similarityScore !== null && (
        <div className="score-container">
          <p className="score">Similarity Score: {Math.round(similarityScore)} %</p>
          <p className="analysis"><strong>Analysis:</strong> {analysis}</p>
          <ul className="reasons">
            {reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TakeATest;
