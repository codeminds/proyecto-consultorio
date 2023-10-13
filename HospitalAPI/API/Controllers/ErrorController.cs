using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API.Controllers
{
    [Route("errors")]
    [ApiController]
    public class ErrorController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ErrorController(IWebHostEnvironment env)
        {
            this._env = env;
        }

        [Route("{statusCode}")]
        public ObjectResult HandleStatus(HttpStatusCode statusCode)
        {
            APIResponse response = new()
            {
                StatusCode = statusCode,
                Success = false
            };

            switch (response.StatusCode)
            {
                case HttpStatusCode.InternalServerError:
                    response.Messages.Add("Ha ocurrido un error desconocido del servidor");

                    //Sólo exponemos información detallada interna de los errores
                    //en el ambiente de desarrollo, nunca en producción
                    if (this._env.IsDevelopment())
                    {
                        Exception? ex = HttpContext.Features.Get<IExceptionHandlerPathFeature>()?.Error;
                        if (ex != null)
                        {
                            response.Data = new
                            {
                                ex.Message,
                                ex.StackTrace,
                                InnerException = ex.InnerException?.Message,
                                ex.Source,
                                ex.HResult
                            };
                        }
                    }
                    break;
            }

            ObjectResult result = new(response)
            {
                StatusCode = (int)statusCode
            };

            return result;
        }
    }
}