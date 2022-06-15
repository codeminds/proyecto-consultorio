﻿using API.Data.Filters;
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
        public async Task<ActionResult<APIResponse>> ListDoctors([FromQuery] FilterDoctorDTO data)
        {
            DoctorListFilter filter = this._mapper.Map<FilterDoctorDTO, DoctorListFilter>(data);

         APIResponse response = new()
         {
            Data = (await this._doctorService.ListDoctors(filter))
                             .Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d))
         };

         return response;
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<APIResponse>> SearchDoctors([FromQuery] string[] s)
        {
         APIResponse response = new()
         {
            Data = (await this._doctorService.SearchDoctors(s))
                             .Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d))
         };

         return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> FindDoctor(int id)
        {
            Doctor? doctor = await this._doctorService.FindDoctor(id);
            if (doctor == null)
            {
                return HttpErrors.NotFound("Doctor no existe en el sistema");
            }

         APIResponse response = new()
         {
            Data = this._mapper.Map<Doctor, GetDoctorDTO>(doctor)
         };

         return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> CreateDoctor(CreateUpdateDoctorDTO data)
        {
            APIResponse response = new();
            response.Success = this._doctorValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                Doctor doctor = await this._doctorService.CreateDoctor(this._mapper.Map<CreateUpdateDoctorDTO, Doctor>(data));
                response.Data = this._mapper.Map<Doctor, GetDoctorDTO>(doctor);
                response.Messages.Add("Doctor ha sido insertado");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> UpdateDoctor(int id, CreateUpdateDoctorDTO data)
        {
            Doctor? doctor = await this._doctorService.FindDoctor(id);
            if (doctor == null)
            {
                return HttpErrors.NotFound("Doctor no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._doctorValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                await this._doctorService.UpdateDoctor(this._mapper.Map(data, doctor));
                response.Data = this._mapper.Map<Doctor, GetDoctorDTO>(doctor);
                response.Messages.Add("Doctor ha sido actualizado");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> DeleteDoctor(int id)
        {
            Doctor? doctor = await this._doctorService.FindDoctor(id);
            if (doctor == null)
            {
                return HttpErrors.NotFound("Doctor no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._doctorValidator.ValidateDelete(id, response.Messages);

            if (response.Success)
            {
                await this._doctorService.DeleteDoctor(doctor);
                response.Data = this._mapper.Map<Doctor, GetDoctorDTO>(doctor);
                response.Messages.Add("Doctor ha sido borrado");
            }

            return response;
        }
    }
}
