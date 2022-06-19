using API;
using API.Data;
using API.Middlewares;
using API.Repositories;
using API.Services;
using API.Validators;
using API.Utils;

//BUILDER
var builder = WebApplication.CreateBuilder(args);

//Establecemos la propiedad Settings de nuestra utilidad
//Configuration con el objeto de configuraciones de .NET
Configuration.Settings = builder.Configuration;

//Al recibir un objeto JSON que no es compatible con los parámetros
//de la acción del controlador, el servidor prepara una respuesta con un código
//HTTP 400 (Bad Request) y crea un objeto específico diferente a nuestro APIResponse,
//sin embargo con esta configuración personalizada controlamos cómo responde el servidor
//creando un objeto APIResponse para responder en vez
builder.Services.AddControllers()
                .ConfigureApiBehaviorOptions(options => {
                    options.InvalidModelStateResponseFactory = context =>
                    {
                        return HttpErrors.BadRequest(data: "Modelo de datos inválido");
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
builder.Services.AddScoped<ISessionValidator, SessionValidator>();
builder.Services.AddScoped<IUserValidator, UserValidator>();

//APP
var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(options =>
{
    options.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader()
           .WithExposedHeaders(ResponseHeaders.AccessTokenExpired, ResponseHeaders.SessionExpired);
});

//Con estas funciones podemos configurar la respuesta del servidor
//ante errores HTTP como error 500, 404, 400 u otros, controlando una ruta
//a la cual dirigirse. En este caso lo enviamos a la ruta de nuestro ErrorController
//que crear los errores con objetos APIResponse para mantener el estándar de nuestras respuestas 
app.UseExceptionHandler("/errors/500");
app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseMiddleware<AuthorizationMiddleware>();
app.MapControllers();

app.Run();
