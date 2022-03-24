using API.DataTransferObjects;
using API.Services;
using API.Validators;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/patients")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IPatientValidator _patientValidator;

        public PatientController(IPatientService patientService, IPatientValidator patientValidator)
        {
            this._patientService = patientService;
            this._patientValidator = patientValidator;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterPatientDTO filter)
        {
            APIResponse response = new APIResponse();
            response.Data = await _patientService.List(filter);
            response.Success = true;

            return response;
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<APIResponse>> Search([FromQuery] string[] s)
        {
            APIResponse response = new APIResponse();
            response.Data = await this._patientService.Search(s);
            response.Success = true;
            return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            APIResponse response = new APIResponse();
            GetPatientDTO? patient = await this._patientService.Get(id);

            if (patient == null)
            {
                return HttpErrors.NotFound("Paciente no encontrado");
            }

            response.Data = patient;
            response.Success = true;
            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdatePatientDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                response.Data = await this._patientService.Insert(data);
                response.Messages.Add("Paciente insertado correctamente");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Update(int id, CreateUpdatePatientDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                GetPatientDTO? patient = await this._patientService.Update(id, data);

                if (patient == null)
                {
                    return HttpErrors.NotFound("Paciente no encontrado");
                }

                response.Data = patient;
                response.Messages.Add("Paciente actualizado correctamente");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Delete(int id)
        {
            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateDelete(id, response.Messages);

            if (response.Success)
            {
                GetPatientDTO? patient = await this._patientService.Delete(id);

                if (patient == null)
                {
                    return HttpErrors.NotFound("Paciente no encontrado");
                }

                response.Data = patient;
                response.Messages.Add("Paciente borrado correctamente");
            }
            return response;
        }
    }
}
