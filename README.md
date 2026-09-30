# AI Interview Platform

An AI-powered interview practice platform that generates customized interview questions and evaluates candidate responses using the OpenAI API.

**Live Demo:** https://ai-interview-platform-phi-rust.vercel.app/

## Features

* Generate customized technical, behavioral, or mixed interviews
* Customize interviews by:

  * Job title
  * Experience level
  * Company
  * Number of questions
  * Candidate background
* Practice one question at a time
* Track time spent on each question
* Track total interview duration
* Submit completed interviews for AI-powered evaluation
* Receive per-question:

  * Score
  * Strengths
  * Areas for improvement
  * Detailed feedback
  * Suggested answer
* Loading and error states
* Responsive frontend
* Deployed frontend and backend

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* C#
* ASP.NET Core
* .NET 10
* REST API

### AI

* OpenAI API

### Deployment

* Docker
* Render
* Vercel

## Architecture

```text
React + TypeScript
       │
       │ HTTP requests
       ▼
ASP.NET Core Web API
       │
       ▼
InterviewService
       │
       │ OpenAI API
       ▼
    OpenAI
```

The frontend is responsible for collecting interview configuration, displaying questions, collecting answers, and presenting evaluation results.

The ASP.NET Core backend handles interview generation and answer evaluation. It constructs prompts, communicates with the OpenAI API, and converts the responses into structured C# models before returning them to the frontend.

The frontend and backend are deployed separately and communicate through HTTP API endpoints.

## API Endpoints

### `POST /interviews`

Generates an interview based on the provided configuration.

**Example request:**

```json
{
  "jobTitle": "Software Engineer",
  "experienceLevel": "Entry Level",
  "company": "Google",
  "interviewType": "Technical",
  "numberOfQuestions": 5,
  "candidateBackground": "Computer Engineering student with C# and React experience."
}
```

Returns a structured list of interview questions and categories.

### `POST /interviews/complete`

Submits completed interview answers for AI evaluation.

**Example request:**

```json
{
  "answers": [
    {
      "question": "Describe a challenging technical problem you solved.",
      "answer": "Example candidate response...",
      "timeTaken": 72
    }
  ]
}
```

Returns structured feedback for each question, including:

* Score
* Strengths
* Areas for improvement
* Detailed feedback
* Suggested answer
* Time taken

## Running Locally

### Prerequisites

* .NET 10 SDK
* Node.js and npm
* OpenAI API key

### Backend

From the project root:

```bash
dotnet restore
dotnet run
```

The backend runs locally at:

```text
http://localhost:5098
```

### OpenAI API Key

The backend expects an environment variable named:

```text
OPENAI_API_KEY
```

For local development, the project uses **.NET User Secrets** so the API key is not stored in the repository.

Initialize User Secrets if needed:

```bash
dotnet user-secrets init
```

Then configure the API key:

```bash
dotnet user-secrets set "OPENAI_API_KEY" "your-api-key"
```

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally at:

```text
http://localhost:5173
```

The frontend uses the `VITE_API_URL` environment variable to determine which backend API to communicate with.

For local development:

```text
VITE_API_URL=http://localhost:5098
```

## Deployment

The application is deployed as two separate services:

* **Frontend:** React/Vite application deployed with Vercel
* **Backend:** ASP.NET Core API containerized with Docker and deployed with Render

Environment variables are used to configure the frontend API URL and securely provide the OpenAI API key to the backend.

The OpenAI API key is kept server-side and is not exposed to the frontend.

## Project Structure

```text
ai-interview-platform/
├── Models/
│   ├── CompletedInterview.cs
│   ├── InterviewAnswer.cs
│   ├── InterviewEvaluation.cs
│   ├── InterviewQuestion.cs
│   ├── QuestionFeedback.cs
│   └── UserData.cs
│
├── Services/
│   └── InterviewService.cs
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── QuestionCard.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── Dockerfile
├── Program.cs
├── ai-interview-platform.csproj
└── README.md
```

## Future Improvements

Potential future additions include:

* Interview history and persistence
* User accounts
* Overall interview performance summaries
* Additional interview question types
* More detailed performance analytics
* Database integration
* Authentication and authorization
* Improved prompt validation and structured AI responses

## Project Goals

This project was built to demonstrate full-stack software engineering skills through a practical application involving:

* Frontend development
* Backend API development
* RESTful communication
* AI API integration
* Structured data handling
* State management
* Docker containerization
* Cloud deployment
* Environment-based configuration
* Secure handling of API credentials
