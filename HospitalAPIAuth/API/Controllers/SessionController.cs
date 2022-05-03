using API.Attributes;
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
    [Route("api/session")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;
        private readonly IUserValidator _userValidator;

        public SessionController(IMapper mapper, ISessionService sessionService, IUserService userService, IUserValidator userValidator)
        {
            this._userService = userService;
            this._mapper = mapper;
            this._sessionService = sessionService;
            this._userValidator = userValidator;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> LogIn(LoginSessionDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._userValidator.ValidateLogin(data, response.Messages);

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
                string username = claims.First(c => c.Type == Claims.User).Value;

                string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
                Session? session = await this._sessionService.FindSession(sessionId);
                if (session == null 
                    || session.User.Email != username 
                    || Convert.ToHexString(session.RefreshToken) != Convert.ToHexString(Crypter.Hash(token, Encoding.UTF8.GetBytes(salt))))
                {
                    return HttpErrors.Unauthorized("Token de refrescado no válido");
                }

                if (session.DateExpiry <= DateTime.Now)
                {
                    await this._sessionService.DeleteSession(session);
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
            string username = claims.First(c => c.Type == Claims.User).Value;
            sessionId = sessionId ?? Guid.Parse(claims.First(c => c.Type == Claims.Session).Value);

            Session? session = await this._sessionService.FindSession(sessionId.Value);
            if (session == null || session.User.Email != username)
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
