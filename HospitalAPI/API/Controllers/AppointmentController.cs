﻿using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IAppointmentService _appointmentService;
        private readonly IAppointmentValidator _appointmentValidator;

        public AppointmentController(IMapper mapper, IAppointmentService appointmentService, IAppointmentValidator appointmentValidator)
        {
            this._mapper = mapper;
            this._appointmentService = appointmentService;
            this._appointmentValidator = appointmentValidator;
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterAppointmentDTO filter)
        {
            APIResponse response = new APIResponse();
            response.Success = true;
            response.Data = (await this._appointmentService.List(filter))
                                .Select(a => this._mapper.Map<Appointment, GetAppointmentDTO>(a));

            return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            APIResponse response = new APIResponse();
            Appointment? appointment = await this._appointmentService.Get(id);

            if (appointment == null)
            {
                return HttpErrors.NotFound("Cita no encontrada");
            }

            response.Success = true;
            response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);

            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdateAppointmentDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._appointmentValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                Appointment appointment = await this._appointmentService.Insert(data);
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita insertada correctamente");
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
                Appointment? appointment = await this._appointmentService.Update(id, data);

                if (appointment == null)
                {
                    return HttpErrors.NotFound("Cita no encontrada");
                }

                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita actualizada correctamente");
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
                Appointment? appointment = await this._appointmentService.Delete(id);

                if (appointment == null)
                {
                    return HttpErrors.NotFound("Cita no encontrada");
                }

                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita borrada correctamente");
            }
            return response;
        }
    }
}
