import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const DEFAULT_QUESTIONS = [
  "What is your primary reason for leaving?",
  "How would you describe your relationship with your manager?",
  "What did you like most about working here?",
  "What did you like least about working here?",
  "Would you recommend this company to others? Why or why not?",
  "What suggestions do you have for improving the work environment?",
  "Did you have the resources and support needed to perform your job effectively?",
  "How would you describe the company culture?",
];

const ExitQuestionnaire = () => {
  const [responses, setResponses] = useState(
    DEFAULT_QUESTIONS.map(q => ({ questionText: q, response: '' }))
  );
  const [status, setStatus] = useState({ message: '', error: false });
  const navigate = useNavigate()

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index].response = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/responses', { responses });
      setStatus({ message: 'Exit questionnaire submitted successfully', error: false });
    } catch (error) {
      setStatus({ 
        message: error.response?.data?.message || 'Failed to submit questionnaire', 
        error: true 
      });
    }
    navigate('/dashboard')
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Exit Interview Questionnaire</h2>
      {status.message && (
        <div className={`mb-4 p-3 rounded ${
          status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {responses.map((item, index) => (
          <div key={index} className="space-y-2">
            <label className="block font-medium">{item.questionText}</label>
            <textarea
              className="w-full p-2 border rounded min-h-[100px]"
              value={item.response}
              onChange={(e) => handleResponseChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit Questionnaire
        </button>
      </form>
    </div>
  );
};

export default ExitQuestionnaire;