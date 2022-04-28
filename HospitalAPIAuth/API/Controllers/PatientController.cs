﻿using API.Attributes;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/patients")]
    [ApiController]
    [Authorize]
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
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterPatientDTO filter)
        {
            APIResponse response = new APIResponse();
            response.Data = (await this._patientService.List(filter))
                                .Select(p => this._mapper.Map<Patient, GetPatientDTO>(p));

            return response;
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<APIResponse>> Search([FromQuery] string[] s)
        {
            APIResponse response = new APIResponse();
            response.Data = (await this._patientService.Search(s))
                                .Select(p => this._mapper.Map<Patient, GetPatientDTO>(p));

            return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            Patient? patient = await this._patientService.Get(id);
            if (patient == null)
            {
                return HttpErrors.NotFound("Paciente no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Data = this._mapper.Map<Patient, GetPatientDTO>(patient);

            return response;
        }

        [HttpPost]
        [Authorize(UserRole.Administrator, UserRole.Editor)]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdatePatientDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                int id = await this._patientService.Insert(this._mapper.Map<CreateUpdatePatientDTO, Patient>(data));
                response.Data = this._mapper.Map<Patient, GetPatientDTO>(await this._patientService.Get(id));
                response.Messages.Add("Paciente insertado correctamente");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(UserRole.Administrator, UserRole.Editor)]
        public async Task<ActionResult<APIResponse>> Update(int id, CreateUpdatePatientDTO data)
        {
            Patient? entity = await this._patientService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Paciente no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                await this._patientService.Update(this._mapper.Map(data, entity));
                response.Data = this._mapper.Map<Patient, GetPatientDTO>(entity);
                response.Messages.Add("Paciente actualizado correctamente");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(UserRole.Administrator, UserRole.Editor)]
        public async Task<ActionResult<APIResponse>> Delete(int id)
        {
            Patient? entity = await this._patientService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Paciente no encontrado");
            }

            APIResponse response = new APIResponse();
            response.Success = this._patientValidator.ValidateDelete(id, response.Messages);

            if (response.Success)
            {
                await this._patientService.Delete(entity);
                response.Data = this._mapper.Map<Patient, GetPatientDTO>(entity);
                response.Messages.Add("Paciente borrado correctamente");
            }

            return response;
        }
    }
}