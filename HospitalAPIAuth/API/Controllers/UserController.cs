using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly ISessionService _sessionService;
        private readonly IUserValidator _userValidator;

        public UserController(IMapper mapper, IUserService userService, ISessionService sessionService, IUserValidator userValidator)
        {
            this._mapper = mapper;
            this._userService = userService;
            this._sessionService = sessionService;
            this._userValidator = userValidator;
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<APIResponse>> Login(LoginUserDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._userValidator.ValidateLogin(data, response.Messages);

            if (response.Success)
            {
                User entity = await this._userService.Get(data.Email);
                if (entity == null)
                {
                    return HttpErrors.NotFound("Usuario y contraseña no existen");
                }

                string hash = Convert.ToHexString(Crypter.Hash(data.Password, entity.PasswordSalt));
                if (hash != Convert.ToHexString(entity.Password))
                {
                    return HttpErrors.NotFound("Usuario y contraseña no existen");
                }

                DateTime now = DateTime.Now;
                Guid sessionId = Guid.NewGuid();
                string refreshToken = Token.IssueRefreshToken(entity, sessionId);
                string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");

                Session session = new Session
                {
                    SessionId = sessionId,
                    UserId = entity.Id,
                    DateIssued = now,
                    AddressIssued = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "N/A",    
                    DateExpiry = now.AddDays(Configuration.Get<int>("Authentication:SessionDays")),
                    RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt))
                };

                await this._sessionService.Insert(session);                    

                response.Data = new GetUserTokensDTO()
                {
                    AccessToken = Token.IssueAccessToken(entity),
                    RefreshToken = refreshToken
                };
            }

            return response;
        }
    }
}
