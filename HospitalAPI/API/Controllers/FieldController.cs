using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/fields")]
    [ApiController]
    public class FieldController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IFieldService _fieldService;

        public FieldController(IMapper mapper, IFieldService fieldService)
        {
            this._mapper = mapper;
            this._fieldService = fieldService;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> ListFields()
        {
         APIResponse response = new()
         {
            Data = (await this._fieldService.ListFields())
                             .Select(f => this._mapper.Map<Field, GetFieldDTO>(f))
         };

         return response;
        }
    }
}
