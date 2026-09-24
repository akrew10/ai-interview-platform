import { useState } from "react";

import "./App.css";
import QuestionCard from "./components/QuestionCard";
type InterviewQuestion = {
  category: string;
  question: string;
};

function App() {
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [company, setCompany] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [candidateBackground, setCandidateBackground] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!jobTitle.trim() || !company.trim()) {
    setError("Please enter a job title and company.");
    return;
  }


  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://localhost:5098/interviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobTitle,
        experienceLevel,
        company,
        interviewType,
        numberOfQuestions,
        candidateBackground,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate interview");
    }

    const result = await response.json();;

    setQuestions(result);
    setCurrentQuestion(0);
    setAnswer("");
  } catch (error) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h1>AI Interview Platform</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
         <input
          type="text"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          required
        />
        </div>

        <div className="form-row">
        <div>
          <label>Experience Level</label>
          <select
            value={experienceLevel}
            onChange={(event) => setExperienceLevel(event.target.value)}
          >
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>
        </div>

        <div>
          <label>Company</label>
          <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              required
            />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Interview Type</label>
          <select
            value={interviewType}
            onChange={(event) => setInterviewType(event.target.value)}
          >
            <option>Technical</option>
            <option>Behavioral</option>
            <option>Mixed</option>
          </select>
        </div>

        <div>
          <label>Number of Questions</label>
          <input
            type="number"
            min="1"
            max="20"
            value={numberOfQuestions}
            onChange={(event) =>
              setNumberOfQuestions(Number(event.target.value))
            }
          />
        </div>
      </div>

        <div>
          <label>Candidate Background (Optional)</label>
          <textarea
            value={candidateBackground}
            onChange={(event) => setCandidateBackground(event.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
        {loading ? "Generating Interview..." : "Generate Interview"}
      </button>
      {error && <p>{error}</p>}
      </form>
      {questions.length > 0 && (
  <div className="interview-results">
    <h2>Your Interview</h2>

  {questions.length > 0 && (
  <div className="interview-results">
    <h2>Your Interview</h2>

    <QuestionCard
      number={currentQuestion + 1}
      category={questions[currentQuestion].category}
      question={questions[currentQuestion].question}
    />

    <div className="answer-section">
  <label>Your Answer</label>

      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Type your answer here..."
      />

      <button
        type="button"
        className="next-button"
        onClick={() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setAnswer("");
          }
        }}
      >
        {currentQuestion === questions.length - 1
          ? "Finish Interview"
          : "Next Question"}
      </button>
    </div>
  </div>
)}
  </div>
)}
    </div>
  );
}

export default App;