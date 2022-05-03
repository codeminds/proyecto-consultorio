using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/patients")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPatientService _patientService;
        private readonly IPatientValidator _patientValidator;

        public PatientController(IMapper mapper, IPatientService patientService, IPatientValidator patientValidator)
        {
            this._mapper = mapper;
            this._patientService = patientService;
            this._patientValidator = patientValidator;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterPatientDTO data)
        {
            PatientListFilter filter = this._mapper.Map<FilterPatientDTO, PatientListFilter>(data);

            APIResponse response = new APIResponse();
            response.Data = (await this._patientService.ListPatients(filter))
                                .Select(p => this._mapper.Map<Patient, GetPatientDTO>(p));

            return response;
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<APIResponse>> Search([FromQuery] string[] s)
        {
            APIResponse response = new APIResponse();
            response.Data = (await this._patientService.SearchPatients(s))
                                .Select(p => this._mapper.Map<Patient, GetPatientDTO>(p));

            return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            Patient? patient = await this._patientService.FindPatient(id);
            if (patient == null)
            {
                return HttpErrors.NotFound("Paciente no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Data = this._mapper.Map<Patient, GetPatientDTO>(patient);

            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdatePatientDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                Patient patient = await this._patientService.CreatePatient(this._mapper.Map<CreateUpdatePatientDTO, Patient>(data));
                response.Data = this._mapper.Map<Patient, GetPatientDTO>(patient);
                response.Messages.Add("Paciente insertado correctamente");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Update(int id, CreateUpdatePatientDTO data)
        {
            Patient? entity = await this._patientService.FindPatient(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Paciente no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                await this._patientService.UpdatePatient(this._mapper.Map(data, entity));
                response.Data = this._mapper.Map<Patient, GetPatientDTO>(entity);
                response.Messages.Add("Paciente actualizado correctamente");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Delete(int id)
        {
            Patient? entity = await this._patientService.FindPatient(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Paciente no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateDelete(id, response.Messages);

            if (response.Success)
            {
                await this._patientService.DeletePatient(entity);
                response.Data = this._mapper.Map<Patient, GetPatientDTO>(entity);
                response.Messages.Add("Paciente borrado correctamente");
            }

            return response;
        }
    }
}
