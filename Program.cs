
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton<InterviewService>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();





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

app.MapPost("/interviews", async (UserData data, InterviewService interviewService) =>
{
    var result = await interviewService.GenerateInterview(data);

    return result;
})
.WithName("CreateInterview");

app.Run();

public record Interview(DateOnly Date, int Id, string? Question)
{

}

public record UserData(string JobTitle, string ExperienceLevel , string Company, string InterviewType, int NumberOfQuestions, string? CandidateBackground)
{
    

}




