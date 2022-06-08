using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Validators;
using AutoMapper;
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
        public async Task<ActionResult<APIResponse>> ListAppointments([FromQuery] FilterAppointmentDTO data)
        { 
            AppointmentListFilter filter = this._mapper.Map<FilterAppointmentDTO, AppointmentListFilter>(data);
            PatientListFilter patientFilter = this._mapper.Map<FilterAppointmentDTO, PatientListFilter>(data);
            DoctorListFilter doctorFilter = this._mapper.Map<FilterAppointmentDTO, DoctorListFilter>(data);

         APIResponse response = new()
         {
            Data = (await this._appointmentService.ListAppointments(filter, patientFilter, doctorFilter))
                             .Select(a => this._mapper.Map<Appointment, GetAppointmentDTO>(a))
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
                return HttpErrors.NotFound("Cita no encontrada");
            }

         APIResponse response = new()
         {
            Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment)
         };

         return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> CreateAppointment(CreateUpdateAppointmentDTO data)
        {
            APIResponse response = new();
            response.Success = this._appointmentValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                Appointment appointment = await this._appointmentService.CreateAppointment(this._mapper.Map<CreateUpdateAppointmentDTO, Appointment>(data));
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita insertada correctamente");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> UpdateAppointment(int id, CreateUpdateAppointmentDTO data)
        {

            Appointment? appointment = await this._appointmentService.FindAppointment(id);
            if (appointment == null)
            {
                return HttpErrors.NotFound("Cita no encontrada");
            }

            APIResponse response = new();
            response.Success = this._appointmentValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                await this._appointmentService.UpdateAppointment(this._mapper.Map(data, appointment));
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita actualizada correctamente");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> DeleteAppointment(int id)
        {
            Appointment? appointment = await this._appointmentService.FindAppointment(id);
            if (appointment == null)
            {
                return HttpErrors.NotFound("Cita no encontrada");
            }

            APIResponse response = new();
            response.Success = this._appointmentValidator.ValidateDelete(id, response.Messages);

            if (response.Success)
            {
                await this._appointmentService.DeleteAppointment(appointment);
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(appointment);
                response.Messages.Add("Cita borrada correctamente");
            }
            return response;
        }
    }
}
