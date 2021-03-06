﻿using API.DataTransferObjects;
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
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IAppointmentValidator _appointmentValidator;

        public AppointmentController(IAppointmentService appointmentService, IAppointmentValidator appointmentValidator)
        {
            this._appointmentService = appointmentService;
            this._appointmentValidator = appointmentValidator;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            APIResponse response = new APIResponse();
            GetAppointmentDTO appointment = await this._appointmentService.Get(id);

            if (appointment == null)
            {
                return HttpErrors.NotFound("Appointment not found");
            }

            response.Data = appointment;
            response.Success = true;
            return response;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterAppointmentDTO filter)
        {
            APIResponse response = new APIResponse();
            response.Data = await this._appointmentService.List(filter);
            response.Success = true;
            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdateAppointmentDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._appointmentValidator.ValidateInsert(data, response.Messages);
            if (response.Success)
            {
                response.Data = await this._appointmentService.Insert(data);
                response.Messages.Add("Appointment inserted successfully");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Update(int id, CreateUpdateAppointmentDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._appointmentValidator.ValidateUpdate(id, data, response.Messages);
            if (response.Success)
            {
                GetAppointmentDTO appointment = await this._appointmentService.Update(id, data);

                if (appointment == null)
                {
                    return HttpErrors.NotFound("Appointment not found");
                }

                response.Data = appointment;
                response.Messages.Add("Appointment updated successfully");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Delete(int id)
        {
            APIResponse response = new APIResponse();
            response.Success = this._appointmentValidator.ValidateDelete(id, response.Messages);
            if (response.Success)
            {
                GetAppointmentDTO appointment = await this._appointmentService.Delete(id);

                if (appointment == null)
                {
                    return HttpErrors.NotFound("Appointment not found");
                }

                response.Data = appointment;
                response.Messages.Add("Appointment deleted successfully");
            }

            return response;
        }
    }
}
