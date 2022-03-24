using API.DataTransferObjects;
using API.Services;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            APIResponse response = new APIResponse();
            response.Data = await this._fieldService.List();
            response.Success = true;
            return response;
        }
    }
}
