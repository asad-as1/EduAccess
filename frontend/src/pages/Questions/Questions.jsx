import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'cookies-js';
import Swal from 'sweetalert2';
import {User} from "lucide-react"
import './Questions.css';

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [updatedAnswerText, setUpdatedAnswerText] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [updatedQuestionTitle, setUpdatedQuestionTitle] = useState('');
  const [updatedQuestionDetails, setUpdatedQuestionDetails] = useState('');
  const user = Cookies.get('user');

  useEffect(() => {
    fetchQuestionById();
    fetchUserProfile();
  }, []);

  const fetchQuestionById = () => {
    axios
      .post(`${import.meta.env.VITE_URL}/qna/questions/${id}`, { token: user })
      .then((response) => {
        setQuestion(response.data);
        console.log(response)
        setUpdatedQuestionTitle(response.data.title);
        setUpdatedQuestionDetails(response.data.details);
      })
      .catch((error) => console.error('Error fetching question:', error));
  };

  const fetchUserProfile = () => {
    axios
      .post(`${import.meta.env.VITE_URL}/user/profile`, { token: user })
      .then((response) => setUserProfile(response.data.user))
      .catch((error) => console.error('Error fetching user profile:', error));
  };

  const handleAnswerSubmit = () => {
    if (!newAnswer.trim()) return;

    axios
      .post(`${import.meta.env.VITE_URL}/qna/questions/${id}/answer`, {
        text: newAnswer,
        token: user,
      })
      .then(() => {
        Swal.fire('Success', 'Answer submitted successfully!', 'success');
        fetchQuestionById();
        setNewAnswer('');
      })
      .catch(() => Swal.fire('Error', 'Error adding answer!', 'error'));
  };

  const handleUpdateAnswer = (answerId, currentText) => {
    setEditingAnswerId(answerId);
    setUpdatedAnswerText(currentText);
  };

  const handleSubmitUpdatedAnswer = (answerId) => {
    if (!updatedAnswerText.trim()) return;

    axios
      .put(`${import.meta.env.VITE_URL}/qna/questions/${id}/answer/${answerId}`, {
        text: updatedAnswerText,
        token: user,
      })
      .then(() => {
        Swal.fire('Updated!', 'Your answer has been updated.', 'success');
        fetchQuestionById();
        setEditingAnswerId(null);
      })
      .catch(() => Swal.fire('Error!', 'Unable to update the answer.', 'error'));
  };

  const handleDeleteQuestion = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the question permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${import.meta.env.VITE_URL}/qna/deletequestion/${id}`, {token: user })
          .then(() => {
            Swal.fire('Deleted!', 'The question has been deleted.', 'success');
            navigate('/queandans');
          })
          .catch(() => Swal.fire('Error!', 'Unable to delete the question.', 'error'));
      }
    });
  };

  const handleDeleteAnswer = (answerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete your answer permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${import.meta.env.VITE_URL}/qna/questions/${id}/answer/${answerId}`, {
            token: user,
          })
          .then(() => {
            Swal.fire('Deleted!', 'Your answer has been deleted.', 'success');
            fetchQuestionById();
          })
          .catch(() => Swal.fire('Error!', 'Unable to delete the answer.', 'error'));
      }
    });
  };

  const handleSubmitUpdatedQuestion = () => {
    if (!updatedQuestionTitle.trim() || !updatedQuestionDetails.trim()) return;

    axios
      .put(`${import.meta.env.VITE_URL}/qna/questions/${id}`, {
        title: updatedQuestionTitle,
        details: updatedQuestionDetails,
        token: user,
      })
      .then(() => {
        Swal.fire('Success', 'Question updated successfully!', 'success');
        setEditingQuestion(false);
        fetchQuestionById();
      })
      .catch(() => Swal.fire('Error!', 'Unable to update the question.', 'error'));
  };

return (
  <div className="question-details-container">
    {question ? (
      <div className="question-details">
        {editingQuestion ? (
          <div className="update-question-card">
            <h2>Update Question</h2>
            <input
              type="text"
              value={updatedQuestionTitle}
              onChange={(e) => setUpdatedQuestionTitle(e.target.value)}
              className="update-question-title"
            />
            <textarea
              value={updatedQuestionDetails}
              onChange={(e) => setUpdatedQuestionDetails(e.target.value)}
              className="update-question-details"
            />
            <div className="update-question-actions">
              <button className="submit-button" onClick={handleSubmitUpdatedQuestion}>
                Save
              </button>
              <button className="cancel-button" onClick={() => setEditingQuestion(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="question-title">{question.title}</h1>
            <p className="question-details-text">Question: {question.details}</p>

            {userProfile && (
              <p className="user-profile-text">
                <User size={18} className="user-icon" />{" "}
                Asked by: {question.user.fullName} ({question.user.username})
              </p>
            )}

            {(question.user._id === userProfile._id || userProfile?.role === "admin") && (
              <div className="question-actions">
                <button className="update-button" onClick={() => setEditingQuestion(true)}>
                  Update Question
                </button>
                <button className="delete-button" onClick={handleDeleteQuestion}>
                  Delete Question
                </button>
              </div>
            )}
          </>
        )}

        {question.answers && question.answers.length > 0 ? (
          <div className="answers-section">
            <h2>Answers</h2>
            <div className="answers-container">
              {question.answers.map((answer) => (
                <div key={answer._id} className="answer-card">
                  {editingAnswerId === answer._id ? (
                    <div className="update-answer-card">
                      <textarea
                        value={updatedAnswerText}
                        onChange={(e) => setUpdatedAnswerText(e.target.value)}
                        className="update-answer-input"
                      />
                      <div className="update-answer-actions">
                        <button
                          className="submit-button"
                          onClick={() => handleSubmitUpdatedAnswer(answer._id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => setEditingAnswerId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="answer-text">{answer.text}</p>
                      <span className="answer-user">
                        <User size={16} className="user-icon" />{" "}
                        {answer.user?.fullName} ({answer.user?.username})
                      </span>

                      {(answer.user._id === userProfile?._id || userProfile?.role === "admin") && (
                        <div className="answer-actions">
                          <button
                            className="update-button"
                            onClick={() => handleUpdateAnswer(answer._id, answer.text)}
                          >
                            Update Answer
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteAnswer(answer._id)}
                          >
                            Delete Answer
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-ans">No answers yet.</p>
        )}

        <div className="answer-form">
          <textarea
            placeholder="Write your answer here..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="answer-input"
          />
          <button onClick={handleAnswerSubmit} className="submit-button">
            Submit Answer
          </button>
        </div>
      </div>
    ) : (
      <p>Loading question...</p>
    )}
  </div>
);

};

export default Questions;
