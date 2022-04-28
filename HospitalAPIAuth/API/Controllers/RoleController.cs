using API.Attributes;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/roles")]
    [ApiController]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IRoleService _RoleService;

        public RoleController(IMapper mapper, IRoleService RoleService)
        {
            this._mapper = mapper;
            this._RoleService = RoleService;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List()
        {
            APIResponse response = new APIResponse();
            response.Data = (await this._RoleService.List())
                                .Select(f => this._mapper.Map<Role, GetRoleDTO>(f));

            return response;
        }
    }
}
