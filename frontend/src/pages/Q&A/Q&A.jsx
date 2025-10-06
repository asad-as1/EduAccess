import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "cookies-js";
import "./Q&A.css";

const QnA = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", details: "" });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const user = Cookies.get("user");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios
      .post(`${import.meta.env.VITE_URL}/qna/allquestions`, { token: user })
      .then((response) => {
        setQuestions(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  };

  const handleNewQuestionClick = () => {
    setShowQuestionForm(true);
  };

  const handleQuestionSubmit = () => {
    if (!newQuestion.title.trim() || !newQuestion.details.trim()) return;

    axios
      .post(`${import.meta.env.VITE_URL}/qna/questions`, {
        ...newQuestion,
        token: user,
      })
      .then((response) => {
        fetchQuestions();
        setShowQuestionForm(false);
        setNewQuestion({ title: "", details: "" });

        Swal.fire({
          icon: "success",
          title: "Question added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => console.error("Error adding question:", error));
  };

  return (
    <div className="qna-container">
      <div className="questions-list">
        <div className="questions-header">
          <h1>Questions</h1>
          <button
            className="new-question-button"
            onClick={handleNewQuestionClick}
          >
            Ask Question
          </button>
        </div>

        <div className="questions-grid">
          {Array.isArray(questions) &&
            questions.map((question) => (
              <div key={question._id} className="question-card">
                <h3 className="question-card-title">{question.title}</h3>
                <p className="question-card-details">Q: {question.details}</p>
                <div className="vieew-btn">
                  <Link
                    to={`/questions/${question._id}`}
                    className="view-button"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {showQuestionForm && (
          <div className="modal-overlay">
            <div className="question-form">
              <h2>Ask a New Question</h2>
              <input
                type="text"
                placeholder="Question title"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                className="form-input"
              />
              <textarea
                placeholder="Question details"
                value={newQuestion.details}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, details: e.target.value })
                }
                className="form-textarea"
              />
              <div className="form-buttons">
                <button
                  className="cancel-button"
                  onClick={() => setShowQuestionForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="submit-button"
                  onClick={handleQuestionSubmit}
                >
                  Submit Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QnA;
