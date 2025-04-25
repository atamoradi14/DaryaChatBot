using DaryaBotApi.Models;
using DaryaBotApi.Services;

const long DEFAULT_MAX_REQUEST_SIZE = 104857600;
var maxRequestSize = Environment.GetEnvironmentVariable("MAX_REQUEST_SIZE_BYTES");
var requestSizeLimit = !string.IsNullOrEmpty(maxRequestSize) && long.TryParse(maxRequestSize, out long size)
            ? size
            : DEFAULT_MAX_REQUEST_SIZE;
var builder = WebApplication.CreateBuilder(args);
#if DEBUG
builder.WebHost.UseKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(8000);
    serverOptions.Limits.MaxRequestBodySize = requestSizeLimit;
});
#else
 builder.WebHost.UseKestrel(serverOptions =>
            {
                serverOptions.ListenAnyIP(80);
                serverOptions.Limits.MaxRequestBodySize = requestSizeLimit;
            });
#endif

// Bind config from environment
builder.Services.Configure<AzureOpenAISettings>(
    builder.Configuration.GetSection("AZURE_OPENAI"));

builder.Services.AddSingleton<AzureOpenAiService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

app.MapControllers();
app.Run();
