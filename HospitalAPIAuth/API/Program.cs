using API;
using API.Data;
using API.Middlewares;
using API.Services;
using API.Utils;
using API.Validators;

//BUILDER
var builder = WebApplication.CreateBuilder(args);

/* Se establece en la utilidad el valor de la propiedad Settings para poder
utilizar la configuraci�n de manera est�tica */
Configuration.Settings = builder.Configuration;

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        /* Elimina el mapping autom�tico de errores de cliente permitiendo 
        que la respuesta sea manejada por UseStatusCodePagesWithReExecute */
        options.SuppressMapClientErrors = true;

        /* Al recibir un objeto JSON que no es compatible con los par�metros
        de la acci�n del controlador, el servidor prepara una respuesta con un c�digo
        HTTP 400 (Bad Request) y crea un objeto espec�fico diferente a nuestro APIResponse,
        sin embargo con esta configuraci�n personalizada controlamos c�mo responde el servidor
        creando un objeto APIResponse para responder en vez */
        options.InvalidModelStateResponseFactory = context =>
        {
            return HttpErrors.BadRequest(data: "Invalid data model");
        };
    });

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddDbContext<HospitalDB>();

//SERVICES
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IFieldService, FieldService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<IStatusService, StatusService>();
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
           .WithExposedHeaders(ResponseHeaders.AccessTokenExpired);
});

/* Con estas funciones podemos configurar la respuesta del servidor
ante errores HTTP como error 404, 500 u otros, controlando una ruta
a la cual dirigirse. En este caso lo enviamos a la ruta de nuestro ErrorController
que crear los errores con objetos APIResponse para mantener el est�ndar de nuestras respuestas */
app.UseExceptionHandler("/errors/500");
app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseMiddleware<AuthorizationMiddleware>();
app.MapControllers();

app.Run();