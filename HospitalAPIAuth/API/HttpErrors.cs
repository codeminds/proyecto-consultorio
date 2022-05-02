using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API
{
    public static class HttpErrors
    {
        public static BadRequestObjectResult BadRequest(string message)
        {
            APIResponse response = new APIResponse();
            response.Messages.Add(message);
            response.Success = false;
            response.StatusCode = HttpStatusCode.BadRequest;

            return new BadRequestObjectResult(response);
        }

        public static UnauthorizedObjectResult Unauthorized(string message)
        {
            APIResponse response = new APIResponse();
            response.Messages.Add(message);
            response.Success = false;
            response.StatusCode = HttpStatusCode.Unauthorized;

            return new UnauthorizedObjectResult(response);
        }

        public static ObjectResult Forbidden(string message)
        {
            APIResponse response = new APIResponse();
            response.Messages.Add(message);
            response.Success = false;
            response.StatusCode = HttpStatusCode.Forbidden;

            ObjectResult result = new ObjectResult(response);
            result.StatusCode = (int)HttpStatusCode.Forbidden;

            return result;
        }

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
