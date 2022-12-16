using API.Attributes;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/genders")]
    [ApiController]
    [Authorize]
    public class GenderController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IGenderService _genderService;

        public GenderController(IMapper mapper, IGenderService genderService)
        {
            this._mapper = mapper;
            this._genderService = genderService;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> ListGenders()
        {
            List<Gender> list = await this._genderService
                                        .ListGenders()
                                        .ToListAsync();

            APIResponse response = new()
            {
                Data = list.Select(g => this._mapper.Map<Gender, GetGenderDTO>(g))
            };

            return response;
        }
    }
}
