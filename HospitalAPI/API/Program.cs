using API;
using API.Data;
using API.Repositories;
using API.Services;
using API.Validators;
using Microsoft.AspNetCore.Mvc;
using System.Net;

//BUILDER
var builder = WebApplication.CreateBuilder(args);

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

//REPOSITORIES
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IFieldRepository, FieldRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();

//SERVICES
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IFieldService, FieldService>();
builder.Services.AddScoped<IPatientService, PatientService>();

//VALIDATORS
builder.Services.AddScoped<IAppointmentValidator, AppointmentValidator>();
builder.Services.AddScoped<IDoctorValidator, DoctorValidator>();
builder.Services.AddScoped<IPatientValidator, PatientValidator>();

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

app.MapControllers();

app.Run();
