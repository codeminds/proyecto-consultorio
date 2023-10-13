using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/statusses")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IStatusService _statusService;

        public StatusController(IMapper mapper, IStatusService statusService)
        {
            this._mapper = mapper;
            this._statusService = statusService;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> ListStatusses()
        {
            List<Status> list = await this._statusService.ListStatusses().ToListAsync();

            APIResponse response = new()
            {
                Data = list.Select(s => this._mapper.Map<Status, GetStatusDTO>(s))
            };

            return response;
        }
    }
}