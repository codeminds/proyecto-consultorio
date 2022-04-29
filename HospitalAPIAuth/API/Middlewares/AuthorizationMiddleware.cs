using API.Attributes;
using API.Data.Models;
using API.Services;
using API.Utils;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Security.Claims;

namespace API.Middlewares
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthorizationMiddleware(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task Invoke(HttpContext context, IUserService userService)
        {
            Endpoint endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
            AuthorizeAttribute authorize = endpoint?.Metadata.GetMetadata<AuthorizeAttribute>();

            if (authorize != null)
            {
                UserRole[] roles = authorize.Roles;
                string token = null;

                if (!context.Request.Headers.TryGetValue("Authorization", out var header))
                {
                    this.SendResponse(context, HttpStatusCode.BadRequest, "Encabezado de autorización no está presente");
                    return;
                }

                token = header;
                try
                {
                    List<Claim> claims = Token.GetValidTokenClaims(token.Split(" ")[1], true);
                    string username = claims.First(c => c.Type == Claims.User).Value;
                    bool isSuperAdmin = bool.Parse(claims.First(c => c.Type == Claims.SuperAdmin).Value);

                    User user = await userService.Get(username);
                    if (user == null)
                    {
                        this.SendResponse(context, HttpStatusCode.Unauthorized, "No está autorizado para realizar esta acción");
                        return;
                    }

                    if (!isSuperAdmin && roles.Any() && !roles.Contains((UserRole)user.Role.Id))
                    {
                        this.SendResponse(context, HttpStatusCode.Forbidden, "No está autorizado para realizar esta acción");
                        return;
                    }
                }
                catch (SecurityTokenExpiredException)
                {
                    context.Response.Headers.Add("Access-Token-Expired", "true");
                    this.SendResponse(context, HttpStatusCode.Unauthorized, "Token ha expirado");
                    return;
                }
                catch (SecurityTokenValidationException)
                {
                    this.SendResponse(context, HttpStatusCode.Unauthorized, "No está autorizado para realizar esta acción");
                    return;
                }
                catch (SecurityTokenException)
                {
                    this.SendResponse(context, HttpStatusCode.BadRequest, "Token no es válido");
                    return;
                }
            }

            await this._next.Invoke(context);
        }

        private async void SendResponse(HttpContext context, HttpStatusCode code, string message)
        {
            APIResponse response = new APIResponse();
            response.Success = false;
            response.StatusCode = code;
            response.Messages = new List<string>() { message };

            context.Response.StatusCode = (int)code;
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
