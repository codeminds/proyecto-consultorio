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
            Request.Headers.TryGetValue("Authorization", out StringValues tokenHeader);

            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new()
            {
                Data = this._mapper.Map<User, GetUserDTO>(user)
            };

            return response;
        }

        [HttpPatch]
        [Route("info")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserInfo(UpdateUserDTO data)
        {
            Request.Headers.TryGetValue("Authorization", out StringValues tokenHeader);

            //Los tokens siempre tienen el prefijo "Bearer" para marcar que tipo de token se está enviando
            //como estándar de la industria. Por lo que un token (e.g.: Bearer 2hfkskwjshfdhussa1312...) debe ser
            //extraído sin la palabra "Bearer" o la validación del mismo fallará. Al estar el valor total del token
            //separado de dicha palabra por un espacio, creamos un array the strings separando el string por espacios
            //en blanco, resultando un array de 2 items (e.g.: ["Bearer", "2hfkskwjshfdhussa1312..."])
            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdateInfo(data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUser(this._mapper.Map(data, user));
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido actualizado");
            }

            return response;
        }

        [HttpPatch]
        [Route("email")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserEmail(UpdateUserEmailDTO data)
        {
            Request.Headers.TryGetValue("Authorization", out StringValues tokenHeader);

            //Los tokens siempre tienen el prefijo "Bearer" para marcar que tipo de token se está enviando
            //como estándar de la industria. Por lo que un token (e.g.: Bearer 2hfkskwjshfdhussa1312...) debe ser
            //extraído sin la palabra "Bearer" o la validación del mismo fallará. Al estar el valor total del token
            //separado de dicha palabra por un espacio, creamos un array the strings separando el string por espacios
            //en blanco, resultando un array de 2 items (e.g.: ["Bearer", "2hfkskwjshfdhussa1312..."])
            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdateEmail(user.Id, data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUser(this._mapper.Map(data, user), true);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido actualizado");
            }

            return response;
        }

        [HttpPatch]
        [Route("password")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserPassword(UpdateUserPasswordDTO data)
        {
            Request.Headers.TryGetValue("Authorization", out StringValues tokenHeader);

            //Los tokens siempre tienen el prefijo "Bearer" para marcar que tipo de token se está enviando
            //como estándar de la industria. Por lo que un token (e.g.: Bearer 2hfkskwjshfdhussa1312...) debe ser
            //extraído sin la palabra "Bearer" o la validación del mismo fallará. Al estar el valor total del token
            //separado de dicha palabra por un espacio, creamos un array the strings separando el string por espacios
            //en blanco, resultando un array de 2 items (e.g.: ["Bearer", "2hfkskwjshfdhussa1312..."])
            string token = tokenHeader.ToString().Split(" ")[1];
            List<Claim> claims = Token.GetTokenClaims(token);
            int id = int.Parse(claims.First(c => c.Type == Claims.User).Value);

            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdatePassword(data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUser(this._mapper.Map(data, user), true);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido actualizado");
            }

            return response;
        }
    }
}