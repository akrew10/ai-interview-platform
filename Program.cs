var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddHttpClient();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};


app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");




var questions = new[]
{
    "Tell us about yourself.", "Why should we hire you?", "Name a time where you showed leadership.", "Do you have any questions for us?" 
};

var interview =  Enumerable.Range(1, 2).Select(index =>
        new Interview
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            index,
            questions[Random.Shared.Next(questions.Length)]
        ))
    .ToArray();


app.MapGet("/interview", () =>
{
 
    return interview;
})
.WithName("GetInterview");



app.MapGet("/interviews/{index}", (int index) =>
{       

    return interview.Where(interview => interview.Id == index);
})
.WithName("GetInterviewIndex");

app.MapPost("/interviews", async (UserData data, HttpClient httpClient) =>
{
    var prompt = $"""
        Generate {data.NumberOfQuestions} interview questions for a
        {data.ExperienceLevel} {data.JobTitle} position at {data.Company}.

        Interview type: {data.InterviewType}

        Candidate background:
        {data.CandidateBackground}
        """;

    // AI API call will go here

    return prompt;
})
.WithName("CreateInterview");

app.Run();

record Interview(DateOnly Date, int Id, string? Question)
{

}

record UserData(string JobTitle, string ExperienceLevel , string Company, string InterviewType, int NumberOfQuestions, string? CandidateBackground)
{
    

}

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}




