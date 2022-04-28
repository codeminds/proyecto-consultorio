using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IUserValidator _userValidator;

        public UserController(IConfiguration configuration, IMapper mapper, IUserService UserService, IUserValidator userValidator)
        {
            this._configuration = configuration;
            this._mapper = mapper;
            this._userService = UserService;
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

                string hash = Convert.ToHexString(Crypter.Hash(data.Password, entity.PasswordSalt, this._configuration));
                if (hash != Convert.ToHexString(entity.Password))
                {
                    return HttpErrors.NotFound("Usuario y contraseña no existen");
                }

                //TODO: generar un sesión nueva

                //TODO: cambiar empty GUID por sesión real
                response.Data = new GetUserTokensDTO()
                {
                    AccessToken = Token.IssueAccessToken(entity, this._configuration),
                    RefreshToken = Token.IssueRefreshToken(entity, Guid.Empty, this._configuration)
                };
            }

            return response;
        }
    }
}
