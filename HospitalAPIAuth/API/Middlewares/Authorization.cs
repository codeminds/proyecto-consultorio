/*using API.Attributes;
using API.Models;
using API.Services;
using API.Utils;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Security.Claims;

namespace API.Middlewares
{
    public class Authorization
    {
        private readonly RequestDelegate _next;

        public Authorization(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task Invoke(HttpContext context, IConfiguration configuration, IUserService userService)
        {
            Endpoint endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
            AuthorizeAttribute authorize = endpoint?.Metadata.GetMetadata<AuthorizeAttribute>();

            if (authorize != null)
            {
                string[] roles = authorize.Roles;
                string token = null;

                if (!context.Request.Headers.TryGetValue("Authorization", out var header))
                {
                    this.SendResponse(context, HttpStatusCode.BadRequest, "Authorization Header Not Present");
                    return;
                }

                token = header;
                try
                {
                    List<Claim> claims = Token.GetValidTokenClaims(token.Split(" ")[1], configuration);
                    string username = claims.First(c => c.Type == Claims.User).Value;
                    User user = await userService.GetUser(username);
                    if (user == null)
                    {
                        this.SendResponse(context, HttpStatusCode.Unauthorized, "You Are Not Auhtorized To Perform This Action");
                        return;
                    }

                    if (roles.Any())
                    {
                        if (!user.Roles.Intersect(roles).Any())
                        {
                            this.SendResponse(context, HttpStatusCode.Forbidden, "You Are Not Authorized To Perform This Action");
                            return;
                        }
                    }
                }
                catch (SecurityTokenValidationException)
                {
                    this.SendResponse(context, HttpStatusCode.Unauthorized, "You Are Not Auhtorized To Perform This Action");
                    return;
                }
            }
            await this._next.Invoke(context);
        }

        private async void SendResponse(HttpContext context, HttpStatusCode code, string response)
        {
            context.Response.StatusCode = (int)code;
            await context.Response.WriteAsync(response);
        }
    }
}*/
