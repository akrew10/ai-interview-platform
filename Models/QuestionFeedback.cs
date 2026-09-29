namespace ai_interview_platform.Models;

public record QuestionFeedback(
    string Question,
    string Answer,
    int Score,
    string Strengths,
    string Improvements,
    string Feedback,
    string SuggestedAnswer,
    int TimeTaken
    
);