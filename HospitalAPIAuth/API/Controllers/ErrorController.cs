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
            APIResponse response = new APIResponse();
            response.StatusCode = statusCode;
            response.Success = false;

            switch (response.StatusCode)
            {
                case HttpStatusCode.NotFound:
                    response.Messages.Add("Recurso no encontrado");
                    break;
                case HttpStatusCode.InternalServerError:
                    response.Messages.Add("Error interno del servidor");

                    //Sólo exponemos información detallada interna de los errores
                    //en el ambiente de desarrollo, nunca en producción
                    if (this._env.IsDevelopment())
                    {
                        var ex = HttpContext.Features.Get<IExceptionHandlerPathFeature>()?.Error;
                        if(ex != null)
                        {
                            response.Data = new
                            {
                                Message = ex.Message,
                                StackTrace = ex.StackTrace,
                                InnerException = ex.InnerException?.Message,
                                Source = ex.Source,
                                HResult = ex.HResult
                            };
                        }
                    }
                    break;
                default:
                    response.Messages.Add("Hubo un problema procesando su petición");
                    break;
            }

            ObjectResult result = new ObjectResult(response);
            result.StatusCode = (int)statusCode;

            return result;
        }
    }
}
