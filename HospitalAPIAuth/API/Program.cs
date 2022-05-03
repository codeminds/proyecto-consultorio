using API;
using API.Data;
using API.Middlewares;
using API.Repositories;
using API.Services;
using API.Validators;
using API.Utils;

//BUILDER
var builder = WebApplication.CreateBuilder(args);

Configuration.Settings = builder.Configuration;

builder.Services.AddControllers()
                .ConfigureApiBehaviorOptions(options => {
                    options.InvalidModelStateResponseFactory = context =>
                    {
                        return HttpErrors.BadRequest("Objeto de datos no válido");
                    }; 
                });

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddDbContext<HospitalDB>();

//REPOSITORIES
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IFieldRepository, FieldRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

//SERVICES
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IFieldService, FieldService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<IUserService, UserService>();

//VALIDATORS
builder.Services.AddScoped<IAppointmentValidator, AppointmentValidator>();
builder.Services.AddScoped<IDoctorValidator, DoctorValidator>();
builder.Services.AddScoped<IPatientValidator, PatientValidator>();
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
