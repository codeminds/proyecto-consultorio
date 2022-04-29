using API.Attributes;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/session")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;
        private readonly IUserValidator _userValidator;

        public SessionController(IMapper mapper, ISessionService sessionService, IUserService userService, IUserValidator userValidator)
        {
            this._userService = userService;
            this._sessionService = sessionService;
            this._userValidator = userValidator;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Login(LoginSessionDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._userValidator.ValidateLogin(data, response.Messages);

            if (response.Success)
            {
                User user = await this._userService.Get(data.Email);
                if (user == null)
                {
                    return HttpErrors.NotFound("Usuario y contraseña no existen");
                }

                string hash = Convert.ToHexString(Crypter.Hash(data.Password, user.PasswordSalt));
                if (hash != Convert.ToHexString(user.Password))
                {
                    return HttpErrors.NotFound("Usuario y contraseña no existen");
                }

                DateTime now = DateTime.Now;
                Guid sessionId = Guid.NewGuid();
                string refreshToken = Token.IssueRefreshToken(user, sessionId);
                string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");

                Session session = new Session
                {
                    SessionId = sessionId,
                    UserId = user.Id,
                    DateIssued = now,
                    AddressIssued = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "--",    
                    DateExpiry = now.AddDays(Configuration.Get<int>("Authentication:SessionDays")),
                    RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt))
                };

                await this._sessionService.Insert(session);                    

                response.Data = new GetSessionTokensDTO()
                {
                    AccessToken = Token.IssueAccessToken(user),
                    RefreshToken = refreshToken
                };
            }

            return response;
        }

        [HttpPut]
        [Authorize]
        [NoExpire]
        public async Task<ActionResult<APIResponse>> RefreshSession(RefreshSessionDTO data)
        {
            try
            {
                List<Claim> claims = Token.GetValidTokenClaims(data.RefreshToken, false);
                Guid sessionId = Guid.Parse(claims.First(c => c.Type == Claims.Session).Value);
                string username = claims.First(c => c.Type == Claims.User).Value;

                string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
                Session session = await this._sessionService.Get(sessionId, username);
                if (session == null || Convert.ToHexString(session.RefreshToken) == Convert.ToHexString(Crypter.Hash(data.RefreshToken, Encoding.UTF8.GetBytes(salt))))
                {
                    return HttpErrors.Unauthorized("Token de refrescado no válido");
                }

                DateTime now = DateTime.Now;
                string refreshToken = Token.IssueRefreshToken(session.User, sessionId);

                session.DateRefreshed = now;
                session.AddressRefreshed = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "--";
                session.DateExpiry = now.AddDays(30);
                session.RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt));

                await this._sessionService.Update(session);

                APIResponse response = new APIResponse();
                response.Data = new GetSessionTokensDTO()
                {
                    AccessToken = Token.IssueAccessToken(session.User),
                    RefreshToken = refreshToken
                };

                return response;
            }
            catch (Exception ex) 
            when (ex is SecurityTokenValidationException 
               || ex is SecurityTokenException)
            {
                return HttpErrors.Unauthorized("Token de refrescado no válido");
            }
        }
    }
}
