using API.Attributes;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/roles")]
    [ApiController]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IRoleService _roleService;

        public RoleController(IMapper mapper, IRoleService roleService)
        {
            this._mapper = mapper;
            this._roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List()
        {
            List<Role> list = await this._roleService
                                        .ListRoles()
                                        .ToListAsync();

            APIResponse response = new()
            {
                Data = list.Select(r => this._mapper.Map<Role, GetRoleDTO>(r))
            };

            return response;
        }
    }
}
