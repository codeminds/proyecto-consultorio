using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/doctors")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IDoctorService _doctorService;
        private readonly IDoctorValidator _doctorValidator;

        public DoctorController(IMapper mapper, IDoctorService doctorService, IDoctorValidator doctorValidator)
        {
            this._mapper = mapper;
            this._doctorService = doctorService;
            this._doctorValidator = doctorValidator;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterDoctorDTO filter)
        {
            APIResponse response = new APIResponse();
            response.Data = (await this._doctorService.List(filter))
                                .Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d));

            return response;
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<APIResponse>> Search([FromQuery] string[] s)
        {
            APIResponse response = new APIResponse();
            response.Data = (await this._doctorService.Search(s))
                                .Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d));

            return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            Doctor? entity = await this._doctorService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Doctor no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Data = this._mapper.Map<Doctor, GetDoctorDTO>(entity);

            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdateDoctorDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._doctorValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                int id = await this._doctorService.Insert(this._mapper.Map<CreateUpdateDoctorDTO, Doctor>(data));
                response.Data = this._mapper.Map<Doctor, GetDoctorDTO>(await this._doctorService.Get(id));
                response.Messages.Add("Doctor insertado correctamente");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Update(int id, CreateUpdateDoctorDTO data)
        {
            Doctor? entity = await this._doctorService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Doctor no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._doctorValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                await this._doctorService.Update(this._mapper.Map(data, entity));
                response.Data = this._mapper.Map<Doctor, GetDoctorDTO>(entity);
                response.Messages.Add("Doctor actualizado correctamente");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Delete(int id)
        {
            Doctor? entity = await this._doctorService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Doctor no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._doctorValidator.ValidateDelete(id, response.Messages);

            if (response.Success)
            {
                await this._doctorService.Delete(entity);
                response.Data = this._mapper.Map<Doctor, GetDoctorDTO>(entity);
                response.Messages.Add("Doctor borrado correctamente");
            }

            return response;
        }
    }
}
