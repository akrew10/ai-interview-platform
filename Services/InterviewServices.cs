using OpenAI.Responses;

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
    public async Task<string> GenerateInterview(UserData data)
    {
        var prompt = $"""
            Generate {data.NumberOfQuestions} interview questions for a
            {data.ExperienceLevel} {data.JobTitle} position at {data.Company}.

            Interview type: {data.InterviewType}

            Candidate background:
            {data.CandidateBackground}
            """;

        ResponseResult response = await _client.CreateResponseAsync(
            "gpt-5.2",
            prompt
        );

        return response.GetOutputText();
    }
}