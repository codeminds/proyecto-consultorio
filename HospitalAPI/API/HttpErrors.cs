using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API
{
    public static class HttpErrors
    {
        public static NotFoundObjectResult NotFound(string message) 
        {
            return new NotFoundObjectResult(new APIResponse() { Messages = { message }, Success = false, StatusCode = System.Net.HttpStatusCode.NotFound });
        }
    }
}
