using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API
{
   public static class HttpErrors
   {
      public static BadRequestObjectResult BadRequest(string? message = null, object? data = null)
      {
         return new BadRequestObjectResult(GetErrorAPIResponse(HttpStatusCode.BadRequest, message, data));
      }

      public static UnauthorizedObjectResult Unauthorized(string? message = null, object? data = null)
      {
         return new UnauthorizedObjectResult(GetErrorAPIResponse(HttpStatusCode.Unauthorized, message, data));
      }

      public static ObjectResult Forbidden(string? message = null, object? data = null)
      {
         APIResponse response = GetErrorAPIResponse(HttpStatusCode.Forbidden, message, data);
         ObjectResult objectResult = new(response)
         {
            StatusCode = (int)HttpStatusCode.Forbidden
         };

         return objectResult;
      }

      public static NotFoundObjectResult NotFound(string? message = null, object? data = null)
      {
         return new NotFoundObjectResult(GetErrorAPIResponse(HttpStatusCode.NotFound, message, data));
      }

      private static APIResponse GetErrorAPIResponse(HttpStatusCode statusCode, string? message, object? data)
      {
         APIResponse response = new()
         {
            StatusCode = statusCode,
            Success = false,
            Data = data,
         };

         if (!string.IsNullOrWhiteSpace(message))
         {
            response.Messages.Add(message);
         }

         return response;
      }
   }
}
