using ai_interview_platform.Models;

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddOpenApi();
builder.Services.AddSingleton<InterviewService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://ai-interview-platform-phi-rust.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("Frontend");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}




app.MapPost("/interviews", async (UserData data, InterviewService interviewService) =>
{
    var result = await interviewService.GenerateInterview(data);

    return result;
})
.WithName("CreateInterview");

app.MapPost("/interviews/complete", async (
    CompletedInterview interview,
    InterviewService interviewService) =>
{
    var evaluation = await interviewService.EvaluateInterview(
        interview.Answers
    );

    return evaluation;
})
.WithName("CompleteInterview");

app.Run();





