using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Sprinto.Server.Common;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;
using System.Text;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders().AddConsole();

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers().AddJsonOptions(
        options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            //options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<DatabaseSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddSprintoServices();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("Database"));

builder.Services.AddAuthentication()
.AddJwtBearer("auth-scheme", jwtOptions =>
{
    // jwtOptions.MetadataAddress = builder.Configuration["Api:MetadataAddress"];
    // Optional if the MetadataAddress is specified
    jwtOptions.Authority = builder.Configuration[Constants.Config.Authority];
    jwtOptions.Audience = builder.Configuration[Constants.Config.Audience];
    jwtOptions.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8
            .GetBytes(builder.Configuration[Constants.Config.AccessSecret]!)
        ),
    };

    jwtOptions.MapInboundClaims = true;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var errorFeature = context.Features.Get<IExceptionHandlerFeature>();
        var exception = errorFeature?.Error;

        var response = new
        {
            Message = Constants.Messages.InternalServerError,
            Details = exception?.Message
        };
        await context.Response.WriteAsJsonAsync(response);
    });
});

app.UseCors("AllowSpecificOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
