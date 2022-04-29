using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API
{
    public static class HttpErrors
    {
        public static NotFoundObjectResult NotFound(string message)
        { 
            APIResponse response = new APIResponse();
            response.Messages.Add(message);
            response.Success = false;
            response.StatusCode = HttpStatusCode.NotFound;

            return new NotFoundObjectResult(response);
        }
    }
}
