using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
         List<Field> list = await this._fieldService.ListFields().ToListAsync();

         APIResponse response = new()
         {
            Data = list.Select(f => this._mapper.Map<Field, GetFieldDTO>(f))
         };

         return response;
      }
   }
}
