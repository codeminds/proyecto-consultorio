using API;
using API.Data;
using API.Middlewares;
using API.Services;
using API.Services.PatientService;
using API.Validators;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using API.Utils;

//BUILDER
var builder = WebApplication.CreateBuilder(args);

Configuration.Settings = builder.Configuration;

builder.Services.AddControllers()
                .ConfigureApiBehaviorOptions(options => {
                    options.InvalidModelStateResponseFactory = context =>
                    {
                        APIResponse response = new APIResponse();
                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.Success = false;

                        return new BadRequestObjectResult(response);
                    }; 
                });

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddDbContext<HospitalDB>();

//SERVICES
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IFieldService, FieldService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ISessionService, SessionService>();

//VALIDATORS
builder.Services.AddScoped<IDoctorValidator, DoctorValidator>();
builder.Services.AddScoped<IPatientValidator, PatientValidator>();
builder.Services.AddScoped<IAppointmentValidator, AppointmentValidator>();
builder.Services.AddScoped<IUserValidator, UserValidator>();

//APP
var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(options =>
{
    options.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseExceptionHandler("/errors/500");
app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseMiddleware<AuthorizationMiddleware>();
app.MapControllers();

app.Run();
