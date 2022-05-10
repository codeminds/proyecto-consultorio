using API.Attributes;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IUserValidator _userValidator;

        public UserController(IMapper mapper, IUserService userService, IUserValidator userValidator)
        {
            
            this._mapper = mapper;
            this._userService = userService;
            this._userValidator = userValidator;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<APIResponse>> GetUser()
        {
            StringValues tokenHeader;
            Request.Headers.TryGetValue("Authorization", out tokenHeader);

            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Data = this._mapper.Map<User, GetUserDTO>(user);

            return response;
        }

        [HttpPatch]
        [Route("info")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserInfo(UpdateUserDTO data)
        {
            StringValues tokenHeader;
            Request.Headers.TryGetValue("Authorization", out tokenHeader);

            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._userValidator.ValidateUpdateInfo(data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUser(this._mapper.Map(data, user));
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario actualizado correctamente");
            }

            return response;
        }

        [HttpPatch]
        [Route("email")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserEmail(UpdateUserEmailDTO data)
        {
            StringValues tokenHeader;
            Request.Headers.TryGetValue("Authorization", out tokenHeader);

            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._userValidator.ValidateUpdateEmail(user.Id, data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUser(this._mapper.Map(data, user), true);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario actualizado correctamente");
            }

            return response;
        }

        [HttpPatch]
        [Route("password")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserPassword(UpdateUserPasswordDTO data)
        {
            StringValues tokenHeader;
            Request.Headers.TryGetValue("Authorization", out tokenHeader);

            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._userValidator.ValidateUpdatePassword(data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUser(this._mapper.Map(data, user), true);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario actualizado correctamente");
            }

            return response;
        }
    }
}
