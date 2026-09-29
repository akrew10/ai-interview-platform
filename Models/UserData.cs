namespace ai_interview_platform.Models;

public record UserData(
    string JobTitle,
    string ExperienceLevel,
    string Company,
    string InterviewType,
    int NumberOfQuestions,
    string? CandidateBackground
    );