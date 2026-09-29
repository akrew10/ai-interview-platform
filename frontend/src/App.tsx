import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

import "./App.css";
import QuestionCard from "./components/QuestionCard";
type InterviewQuestion = {
  category: string;
  question: string;
};

type QuestionFeedback = {
  question: string;
  answer: string;
  score: number;
  strengths: string;
  improvements: string;
  feedback: string;
  suggestedAnswer: string;
  timeTaken: number;
};

type InterviewEvaluation = {
  feedback: QuestionFeedback[];
};

type InterviewAnswer = {
  question: string;
  answer: string;
  timeTaken: number;
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
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [completed, setCompleted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
  if (questions.length === 0 || completed) {
    return;
  }

  setElapsedTime(0);

  const timer = setInterval(() => {
    setElapsedTime((time) => time + 1);
  }, 1000);

  return () => clearInterval(timer);
}, [currentQuestion, questions.length, completed]);

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!jobTitle.trim() || !company.trim()) {
    setError("Please enter a job title and company.");
    return;
  }


  setLoading(true);
  setError("");

  try {
    const response = await fetch(`${API_URL}/interviews`, {
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
    setTotalTime(0);
    setAnswer("");
    setAnswers([]);
  } catch (error) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


const handleFinish = async (completedAnswers: InterviewAnswer[]) => {
  setEvaluating(true);
  setError("");

  try {
    const response = await fetch(`${API_URL}/interviews/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: completedAnswers,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit interview");
    }

    const result: InterviewEvaluation = await response.json();

    setEvaluation(result);
    setCompleted(true);
  } catch (error) {
    setError("Something went wrong submitting the interview.");
  } finally {
    setEvaluating(false);
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

        <button
        type="submit"
          disabled={loading || (questions.length > 0 && !completed) || evaluating}
        >
          {loading
            ? "Generating..."
            : evaluating
              ? "Evaluating..."
              : questions.length > 0 && !completed
                ? "Interview in Progress"
                : "Generate Interview"}
        </button>
      {error && <p>{error}</p>}
      </form>

  {questions.length > 0 && !completed && !evaluating && (
  <div className="interview-results">
    <h2>Your Interview</h2>
    <div className="timer">
    Time: {Math.floor(elapsedTime / 60)
      .toString()
      .padStart(2, "0")}
    :
    {(elapsedTime % 60).toString().padStart(2, "0")}
  </div>

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
        if (!answer.trim()) {
          setError("Please enter an answer before continuing.");
          return;
        }

        setError("");

        const current = questions[currentQuestion];

      const updatedAnswers = [
          ...answers,
          {
            question: current.question,
            answer: answer,
            timeTaken: elapsedTime,
          },
        ];

        setAnswers(updatedAnswers);

        const updatedTotalTime = totalTime + elapsedTime;
        setTotalTime(updatedTotalTime);

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAnswer("");
        } else {
          handleFinish(updatedAnswers);
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

{evaluating && (
  <div className="interview-results">
    <h2>Evaluating Your Answers...</h2>
    <p>
      Our AI is reviewing your responses. This may take a few seconds.
    </p>
  </div>
)}
{completed && !evaluating && evaluation && (
  <div className="interview-results">
   <h2>Interview Complete!</h2>
   <p>Your answers have been evaluated.</p>

    <div className="total-time">
      <h3>Total Time Taken</h3>
      <p>
        {Math.floor(totalTime / 60)
          .toString()
          .padStart(2, "0")}
        :
        {(totalTime % 60).toString().padStart(2, "0")}
      </p>
    </div>

    <div className="feedback-list">
      {evaluation.feedback.map((item, index) => (
        
        
        <div className="feedback-card" key={index}>
          <h3>
            Question {index + 1}
          </h3>

          <p className="feedback-question">
            {item.question}
          </p>

          <div className="candidate-answer">
            <h4>Your Answer</h4>
            <p>{item.answer}</p>
          </div>

          <div className="feedback-score">
            Score: {item.score}/10
          </div>

          <div className="feedback-time">
            Time Taken:{" "}
            {Math.floor(item.timeTaken / 60)
              .toString()
              .padStart(2, "0")}
            :
            {(item.timeTaken % 60).toString().padStart(2, "0")}
          </div>

          <div className="feedback-section">
            <h4>Strengths</h4>
            <p>{item.strengths}</p>
          </div>

          <div className="feedback-section">
            <h4>Areas for Improvement</h4>
            <p>{item.improvements}</p>
          </div>

          <div className="feedback-section">
            <h4>Feedback</h4>
            <p>{item.feedback}</p>
          </div>

          <div className="feedback-section">
            <h4>Suggested Answer</h4>
            <p>{item.suggestedAnswer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
  </div>

  
  );
}

export default App;