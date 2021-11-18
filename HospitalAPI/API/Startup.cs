using API.Data;
using API.Services;
using API.Validators;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Diagnostics;
using Newtonsoft.Json;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using API.Controllers;

namespace API
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                    .ConfigureApiBehaviorOptions(options => {
                        options.InvalidModelStateResponseFactory = context =>
                        {
                            APIResponse response = new APIResponse();
                            response.StatusCode = HttpStatusCode.BadRequest;
                            response.Success = false;

                            return new BadRequestObjectResult(response);
                        };
                    });

            services.AddAutoMapper(typeof(Startup));
            services.AddDbContext<HospitalDB>();

            //SERVICES
            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<IFieldService, FieldService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IAppointmentService, AppointmentService>();

            //VALIDATORS
            services.AddScoped<IDoctorValidator, DoctorValidator>();
            services.AddScoped<IPatientValidator, PatientValidator>();
            services.AddScoped<IAppointmentValidator, AppointmentValidator>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(cors =>
            {
                cors.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });

            app.UseExceptionHandler("/errors/500");
            app.UseStatusCodePagesWithReExecute("/errors/{0}");
            
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
