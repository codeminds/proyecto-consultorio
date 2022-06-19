using API.Attributes;
using API.Data.Models;
using API.Services;
using API.Utils;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Primitives;
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

        public async Task Invoke(HttpContext context, ISessionService sessionService)
        {
            Endpoint endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint!;
            AuthorizeAttribute? authorize = endpoint?.Metadata.GetMetadata<AuthorizeAttribute>();

            if (authorize != null)
            {
                UserRole[] roles = authorize.Roles;

                if (!context.Request.Headers.TryGetValue("Authorization", out StringValues token))
                {
                    SendResponse(context, HttpStatusCode.BadRequest, data: "Encabezado de autorización no está presente");
                    return;
                }

                try
                {
                    //Los tokens siempre tienen el prefijo "Bearer" para marcar que tipo de token se está enviando
                    //como estándar de la industria. Por lo que un token (e.g.: Bearer 2hfkskwjshfdhussa1312...) debe ser
                    //extraído sin la palabra "Bearer" o la validación del mismo fallará. Al estar el valor total del token
                    //separado de dicha palabra por un espacio, creamos un array the strings separando el string por espacios
                    //en blanco, resultando un array de 2 items (e.g.: ["Bearer", "2hfkskwjshfdhussa1312..."])
                    List<Claim> claims = Token.GetValidTokenClaims(token.ToString().Split(" ")[1], true);
                    Guid sessionId = Guid.Parse(claims.First(c => c.Type == Claims.Session).Value);

                    Session? session = await sessionService.FindSession(sessionId);
                    if (session == null)
                    {
                        SendResponse(context, HttpStatusCode.Unauthorized, "Su sesión ha expirado");
                        return;
                    }

                    if (!session.User.IsSuperAdmin && roles.Any() && !roles.Contains((UserRole)session.User.RoleId))
                    {
                        SendResponse(context, HttpStatusCode.Forbidden, "No está autorizado para realizar esta acción");
                        return;
                    }

                    if (session.DateExpiry <= DateTime.Now)
                    {
                        await sessionService.DeleteSession(session);
                        context.Response.Headers.Add(ResponseHeaders.SessionExpired, "true");
                        SendResponse(context, HttpStatusCode.Unauthorized, "Su sesión ha expirado");
                        return;
                    }
                }
                catch (SecurityTokenExpiredException)
                {
                    context.Response.Headers.Add(ResponseHeaders.AccessTokenExpired, "true");
                    SendResponse(context, HttpStatusCode.Unauthorized);
                    return;
                }
                catch (SecurityTokenException)
                {
                    SendResponse(context, HttpStatusCode.BadRequest, data: "Token de acceso no es válido");
                    return;
                }
            }

            await this._next.Invoke(context);
        }

        private static async void SendResponse(HttpContext context, HttpStatusCode code, string? message = null, object? data = null)
        {
            APIResponse response = new()
            {
                Success = false,
                StatusCode = code,
                Data = data
            };
            
            if(!string.IsNullOrEmpty(message))
            { 
                response.Messages.Add(message);
            }

            context.Response.StatusCode = (int)code;
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
