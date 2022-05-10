using API.Attributes;
using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/sessions")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;
        private readonly ISessionValidator _sessionValidator;

        public SessionController(IMapper mapper, ISessionService sessionService, IUserService userService, ISessionValidator sessionValidator)
        {
            this._mapper = mapper;
            this._userService = userService;
            this._sessionService = sessionService;
            this._sessionValidator = sessionValidator;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<APIResponse>> ListSessions([FromQuery] FilterSessionDTO data)
        {
            SessionListFilter filter = this._mapper.Map<FilterSessionDTO, SessionListFilter>(data);

            StringValues tokenHeader;
            Request.Headers.TryGetValue("Authorization", out tokenHeader);

            List<Claim> claims = Token.GetTokenClaims(tokenHeader.ToString().Split(" ")[1]);
            int userId = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            APIResponse response = new APIResponse();
            response.Data = (await this._sessionService.ListSessions(userId, filter))
                                .Select(p => this._mapper.Map<Session, GetSessionDTO>(p));

            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> LogIn(LoginSessionDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._sessionValidator.ValidateLogin(data, response.Messages);

            if (response.Success)
            {
                User? user = await this._userService.FindUser(data.Email!);
                if (user == null)
                {
                    return HttpErrors.NotFound("Usuario y contraseña no existen");
                }

                string hash = Convert.ToHexString(Crypter.Hash(data.Password!, user.PasswordSalt));
                if (hash != Convert.ToHexString(user.Password))
                {
                    return HttpErrors.NotFound("Usuario y contraseña no existen");
                }

                Session session = await this._sessionService.CreateUserSession(user, Request.HttpContext.Connection.RemoteIpAddress);
                response.Data = this._mapper.Map<Session, GetSessionTokensDTO>(session);
            }

            return response;
        }

        [HttpPut]
        public async Task<ActionResult<APIResponse>> RefreshSession()
        {
            try
            {
                StringValues tokenHeader;
                if (!Request.Headers.TryGetValue("Session", out tokenHeader))
                {
                    return HttpErrors.BadRequest("Encabezado de sesión no está presente");
                }

                string token = tokenHeader.ToString().Split(" ")[1];
                List<Claim> claims = Token.GetValidTokenClaims(token, false);
                Guid sessionId = Guid.Parse(claims.First(c => c.Type == Claims.Session).Value);

                string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
                byte[] tokenHash = Crypter.Hash(token, Encoding.UTF8.GetBytes(salt));

                Session? session = await this._sessionService.FindSession(sessionId);
                if (session == null || Convert.ToHexString(session.RefreshToken) != Convert.ToHexString(tokenHash))
                {
                    return HttpErrors.Unauthorized("Token de refrescado no válido");
                }

                if (session.DateExpiry <= DateTime.Now)
                {
                    await this._sessionService.DeleteSession(session);
                    Response.Headers.Add("Session-Expired", "true");
                    return HttpErrors.Unauthorized("Sesión ha expirado");
                }

                await this._sessionService.RefreshUserSession(session.User, session, Request.HttpContext.Connection.RemoteIpAddress);

                APIResponse response = new APIResponse();
                response.Data = this._mapper.Map<Session, GetSessionTokensDTO>(session);

                return response;
            }
            catch (Exception ex) 
            when (ex is SecurityTokenValidationException 
               || ex is SecurityTokenException)
            {
                return HttpErrors.Unauthorized("Token de refrescado no válido");
            }
        }

        [HttpDelete]
        [Route("{sessionId?}")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> LogOut(Guid? sessionId = null)
        {
            StringValues tokenHeader;
            Request.Headers.TryGetValue("Authorization", out tokenHeader);

            List<Claim> claims = Token.GetTokenClaims(tokenHeader.ToString().Split(" ")[1]);
            int userId = int.Parse(claims.First(c => c.Type == Claims.User).Value);
            sessionId = sessionId ?? Guid.Parse(claims.First(c => c.Type == Claims.Session).Value);

            Session? session = await this._sessionService.FindSession(sessionId.Value);
            if (session == null || session.UserId != userId)
            {
                return HttpErrors.NotFound("Sesión no encontrada");
            }

            await this._sessionService.DeleteSession(session);

            APIResponse response = new APIResponse();
            response.Data = this._mapper.Map<Session, GetSessionDTO>(session);

            return response;
        }
    }
}
