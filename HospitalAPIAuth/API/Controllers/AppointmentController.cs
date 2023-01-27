using API.Attributes;
using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    [Authorize]
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
        public async Task<ActionResult<APIResponse>> ListAppointments([FromQuery] FilterAppointmentDTO data)
        { 
            AppointmentListFilter filter = this._mapper.Map<FilterAppointmentDTO, AppointmentListFilter>(data);
            List<Appointment> list = await this._appointmentService.ListAppointments(filter).ToListAsync();

            APIResponse response = new()
            {
                Data = list.Select(a => this._mapper.Map<Appointment, GetAppointmentDTO>(a))
            };

            return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> FindAppointment(int id)
        {
            Appointment? appointment = await this._appointmentService.FindAppointment(id);
            if (appointment == null)
            {
                return HttpErrors.NotFound("Cita no existe en el sistema");
            }

            APIResponse response = new()
            {
                Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment)
            };

            return response;
        }

        [HttpPost]
        [Authorize(UserRole.Administrator, UserRole.Editor)]
        public async Task<ActionResult<APIResponse>> InsertAppointment(InsertUpdateAppointmentDTO data)
        {
            APIResponse response = new();
            response.Success = this._appointmentValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                Appointment appointment = this._mapper.Map<InsertUpdateAppointmentDTO, Appointment>(data);
                await this._appointmentService.InsertAppointment(appointment);

                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita ha sido insertada");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(UserRole.Administrator, UserRole.Editor)]
        public async Task<ActionResult<APIResponse>> UpdateAppointment(int id, InsertUpdateAppointmentDTO data)
        {

            Appointment? appointment = await this._appointmentService.FindAppointment(id);
            if (appointment == null)
            {
                return HttpErrors.NotFound("Cita no existe en el sistema");
            }

            APIResponse response = new();
            response.Success = this._appointmentValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                await this._appointmentService.UpdateAppointment(this._mapper.Map(data, appointment));
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita ha sido actualizada");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(UserRole.Administrator, UserRole.Editor)]
        public async Task<ActionResult<APIResponse>> DeleteAppointment(int id)
        {
            Appointment? appointment = await this._appointmentService.FindAppointment(id);
            if (appointment == null)
            {
                return HttpErrors.NotFound("Cita no existe en el sistema");
            }

            APIResponse response = new();

            await this._appointmentService.DeleteAppointment(appointment);
            response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
            response.Messages.Add("Cita ha sido borrada");

            return response;
        }
    }
}
