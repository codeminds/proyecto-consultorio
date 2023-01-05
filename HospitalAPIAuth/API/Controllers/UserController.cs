using API.Attributes;
using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<APIResponse>> ListUsers([FromQuery] FilterUserDTO data)
        {
            UserListFilter filter = this._mapper.Map<FilterUserDTO, UserListFilter>(data);
            List<User> list = await this._userService
                                        .ListUsers(filter)
                                        .Include(u => u.Role)
                                        .ToListAsync();

            APIResponse response = new()
            {
                Data = list.Select(u => this._mapper.Map<User, GetUserDTO>(u))
            };

            return response;
        }

        [HttpGet]
        [Route("me")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> GetCurrentUser()
        {
            User? user = await this._userService.FindUser(Convert.ToInt32(HttpContext.Items[Claims.User]));
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

        [HttpPost]
        [Authorize(UserRole.Administrator)]
        public async Task<ActionResult<APIResponse>> InsertUser(InsertUserDTO data)
        {
            APIResponse response = new();
            response.Success = this._userValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                User user = this._mapper.Map<InsertUserDTO, User>(data);
                await this._userService.InsertUser(user);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido insertado");
            }

            return response;
        }

        [HttpPatch]
        [Route("info/{id}")]
        [Authorize(UserRole.Administrator)]
        public async Task<ActionResult<APIResponse>> UpdateUserInfo(int id, UpdateUserInfoDTO data)
        {
            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdateInfo(user.Id, data, response.Messages, !Convert.ToBoolean(HttpContext.Items[Claims.SuperAdmin]));

            if (response.Success)
            {
                await this._userService.UpdateUserInfo(this._mapper.Map(data, user));
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido actualizado");
            }

            return response;
        }

        [HttpPatch]
        [Route("info")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserInfo(UpdateUserInfoDTO data)
        {
            User? user = await this._userService.FindUser(Convert.ToInt32(HttpContext.Items[Claims.User]));
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdateInfo(user.Id, data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUserInfo(this._mapper.Map(data, user));
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido actualizado");
            }

            return response;
        }

        [HttpPatch]
        [Route("email/{id}")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserEmail(int id, UpdateUserEmailDTO data)
        {
            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdateEmail(user.Id, data, response.Messages, !Convert.ToBoolean(HttpContext.Items[Claims.SuperAdmin]));

            if (response.Success)
            {
                await this._userService.UpdateUserEmail(this._mapper.Map(data, user));
                response.Data = this._mapper.Map<User, GetUserDTO>(this._mapper.Map(data, user));
                response.Messages.Add("Correo ha sido actualizado");
            }

            return response;
        }

        [HttpPatch]
        [Route("email")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserEmail(UpdateUserEmailDTO data)
        {
            User? user = await this._userService.FindUser(Convert.ToInt32(HttpContext.Items[Claims.User]));
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdateEmail(user.Id, data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUserEmail(this._mapper.Map(data, user));
                response.Data = this._mapper.Map<User, GetUserDTO>(this._mapper.Map(data, user));
                response.Messages.Add("Correo ha sido actualizado");
            }

            return response;
        }

        [HttpPatch]
        [Route("password")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateUserPassword(UpdateUserPasswordDTO data)
        {
            User? user = await this._userService.FindUser(Convert.ToInt32(HttpContext.Items[Claims.User]));
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdatePassword(data, response.Messages);

            if (response.Success)
            {
                await this._userService.UpdateUserPassword(this._mapper.Map(data, user));
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Contraseña ha sido actualizada");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(UserRole.Administrator)]
        public async Task<ActionResult<APIResponse>> DeleteUser(int id)
        {
            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateDelete(id, response.Messages, !Convert.ToBoolean(HttpContext.Items[Claims.SuperAdmin]));

            if (response.Success)
            {
                await this._userService.DeleteUser(user);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido borrado");
            }

            return response;
        }
    }
}