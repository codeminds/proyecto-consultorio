using API.DataTransferObjects;
using API.Services;
using API.Validators;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/fields")]
    [ApiController]
    public class FieldController : ControllerBase
    {
        private readonly IFieldService _fieldService;

        public FieldController(IFieldService fieldService)
        {
            this._fieldService = fieldService;
        }
      

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List()
        {
            APIResponse response = new APIResponse();
            response.Data = await this._fieldService.List();
            response.Success = true;
            return response;
        }
    }
}
