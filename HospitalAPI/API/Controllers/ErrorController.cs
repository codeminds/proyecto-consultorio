﻿using API.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;

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
                    response.Messages.Add("Resource not found");
                    break;
                case HttpStatusCode.InternalServerError:
                    response.Messages.Add("An unknown error occurred");
                    if (this._env.IsDevelopment())
                    {
                        var ex = HttpContext.Features.Get<IExceptionHandlerPathFeature>()?.Error;
                        if (ex != null)
                        {
                            response.Data = new
                            {
                                Message = ex.Message,
                                StackTrace = ex.StackTrace,
                                InnerException = ex.InnerException,
                                Source = ex.Source,
                                HResult = ex.HResult
                            };
                        }
                        
                    }
                    break;
                default:
                    response.Messages.Add("There was a problem with your request");
                    break;
            }

            return new ObjectResult(response) { StatusCode = (int)statusCode };
        }
    }
}
