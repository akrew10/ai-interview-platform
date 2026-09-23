using OpenAI.Responses;
using System.Text.Json;
using ai_interview_platform.Models;

#pragma warning disable OPENAI001

public class InterviewService
{
    private readonly ResponsesClient _client;

    public InterviewService(IConfiguration configuration)
    {
        var apiKey = configuration["OPENAI_API_KEY"];

        _client = new ResponsesClient(
            apiKey: apiKey
        );
    }
    public async Task<List<InterviewQuestion>> GenerateInterview(UserData data)
    {
        var prompt = $$"""
            Generate {{data.NumberOfQuestions}} interview questions for a
            {{data.ExperienceLevel}} {{data.JobTitle}} position at {{data.Company}}.

            Interview type: {{data.InterviewType}}

            Candidate background:
            {{data.CandidateBackground}}

            Return the response as a JSON array.

            Each question should contain:
            - "category": a short category describing the question
            - "question": the actual interview question

            Return only valid JSON.
            Do not include Markdown, code fences, introductions, or conclusions.

            Example:
            [
            {
                "category": "C#/.NET Fundamentals",
                "question": "How would you implement an LRU cache in C#?"
            },
            {
                "category": "API Design",
                "question": "How would you design a simple REST API?"
            }
            ]
            """;

        ResponseResult response = await _client.CreateResponseAsync(
            "gpt-5.2",
            prompt
        );

        var json = response.GetOutputText();

        var questions = JsonSerializer.Deserialize<List<InterviewQuestion>>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }
        );

        return questions ?? [];
    }
}