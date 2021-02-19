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
    [Route("api/doctors")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly IDoctorValidator _doctorValidator;

        public DoctorController(IDoctorService doctorService, IDoctorValidator doctorValidator)
        {
            this._doctorService = doctorService;
            this._doctorValidator = doctorValidator;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            throw new Exception("Wtf");
            APIResponse response = new APIResponse();
            GetDoctorDTO doctor = await this._doctorService.Get(id);

            if (doctor == null) 
            {
                return HttpErrors.NotFound("Doctor not found");
            } 
               
            response.Data = doctor;
            response.Success = true;
            return response;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterDoctorDTO filter)
        {
            APIResponse response = new APIResponse();
            response.Data = await this._doctorService.List(filter);
            response.Success = true;
            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdateDoctorDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._doctorValidator.ValidateInsert(data, response.Messages);
            if (response.Success)
            {
                response.Data = await this._doctorService.Insert(data);
                response.Messages.Add("Doctor inserted successfully");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Update(int id, CreateUpdateDoctorDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._doctorValidator.ValidateUpdate(id, data, response.Messages);
            if (response.Success)
            {
                GetDoctorDTO doctor = await this._doctorService.Update(id, data);

                if (doctor == null)
                {
                    return HttpErrors.NotFound("Doctor not found");
                }

                response.Data = doctor;
                response.Messages.Add("Doctor updated successfully");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Delete(int id)
        {
            APIResponse response = new APIResponse();
            response.Success = this._doctorValidator.ValidateDelete(id, response.Messages);
            if (response.Success)
            {
                GetDoctorDTO doctor = await this._doctorService.Delete(id);

                if (doctor == null)
                {
                    return HttpErrors.NotFound("Doctor not found");
                }

                response.Data = doctor;
                response.Messages.Add("Doctor deleted successfully");
            }

            return response;
        }
    }
}
