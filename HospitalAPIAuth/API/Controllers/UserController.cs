using API.Data.Filters;
using API.Attributes;
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
    [Authorize]
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
        [Authorize(UserRole.Administrator)]
        public async Task<ActionResult<APIResponse>> ListUsers([FromQuery] FilterUserDTO data)
        {
            UserListFilter filter = this._mapper.Map<FilterUserDTO, UserListFilter>(data);
            List<User> list = await this._userService.ListUsers(filter)
                                    .OrderBy(u => u.FirstName)
                                    .ThenBy(u => u.LastName)
                                    .ToListAsync();

            APIResponse response = new()
            {
                Data = list.Select(u => this._mapper.Map<User, GetUserDTO>(u))
            };

            return response;
        }

        [HttpPost]
        [Authorize(UserRole.Administrator)]
        public async Task<ActionResult<APIResponse>> InsertUser(InsertUpdateUserDTO data)
        {
            APIResponse response = new();
            response.Success = this._userValidator.ValidateInsertUpdate(null, data, Convert.ToBoolean(HttpContext.Items[Claims.SuperAdmin]), response.Messages);

            if (response.Success)
            {
                User user = this._mapper.Map<InsertUpdateUserDTO, User>(data);
                await this._userService.InsertUser(user);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido insertado");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(UserRole.Administrator)]
        public async Task<ActionResult<APIResponse>> UpdateUser(int id, InsertUpdateUserDTO data)
        {
            User? user = await this._userService.FindUser(id);
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateInsertUpdate(id, data, Convert.ToBoolean(HttpContext.Items[Claims.SuperAdmin]), response.Messages);

            if (response.Success)
            {
                this._mapper.Map(data, user);
                await this._userService.UpdateUser(user);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido actualizado");
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
            response.Success = this._userValidator.ValidateDelete(id, Convert.ToBoolean(HttpContext.Items[Claims.SuperAdmin]), response.Messages);

            if (response.Success)
            {
                await this._userService.DeleteUser(user);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido borrado");
            }

            return response;
        }

        [HttpGet]
        [Route("me")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> GetCurrentUser()
        {
            User? user = await this._userService.FindUser(Convert.ToInt32(HttpContext.Items[Claims.UserId]));
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new()
            {
                Data = this._mapper.Map<User, GetUserDTO>(user!)
            };

            return response;
        }

        [HttpPut]
        [Route("me")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> UpdateCurrentUser(UpdateSelfUserDTO data)
        {
            User? user = await this._userService.FindUser(Convert.ToInt32(HttpContext.Items[Claims.UserId]));
            if (user == null)
            {
                return HttpErrors.NotFound("Usuario no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._userValidator.ValidateUpdateSelf(user.Id, data, response.Messages);

            if (response.Success)
            {
                this._mapper.Map(data, user);
                await this._userService.UpdateUser(user);
                response.Data = this._mapper.Map<User, GetUserDTO>(user);
                response.Messages.Add("Usuario ha sido actualizado");
            }

            return response;
        }
    }
}