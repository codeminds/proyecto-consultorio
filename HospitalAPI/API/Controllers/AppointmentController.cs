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
        public async Task<ActionResult<APIResponse>> List([FromQuery] FilterAppointmentDTO filter)
        {
            APIResponse response = new APIResponse();
            response.Data = (await this._appointmentService.List(filter))
                                .Select(a => this._mapper.Map<Appointment, GetAppointmentDTO>(a));

            return response;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Get(int id)
        {
            Appointment? entity = await this._appointmentService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Cita no encontrada");
            }

            APIResponse response = new APIResponse();
            response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(entity);

            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> Insert(CreateUpdateAppointmentDTO data)
        {
            APIResponse response = new APIResponse();
            response.Success = this._appointmentValidator.ValidateInsert(data, response.Messages);

            if (response.Success)
            {
                int id = await this._appointmentService.Insert(this._mapper.Map<CreateUpdateAppointmentDTO, Appointment>(data));
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(await this._appointmentService.Get(id));
                response.Messages.Add("Cita insertada correctamente");
            }

            return response;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Update(int id, CreateUpdateAppointmentDTO data)
        {

            Appointment? entity = await this._appointmentService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Cita no encontrada");
            }

            APIResponse response = new APIResponse();
            response.Success = this._appointmentValidator.ValidateUpdate(id, data, response.Messages);

            if (response.Success)
            {
                await this._appointmentService.Update(this._mapper.Map(data, entity));
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(entity);
                response.Messages.Add("Cita actualizada correctamente");
            }

            return response;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<APIResponse>> Delete(int id)
        {
            Appointment? entity = await this._appointmentService.Get(id);
            if (entity == null)
            {
                return HttpErrors.NotFound("Cita no encontrada");
            }

            APIResponse response = new APIResponse();
            response.Success = this._appointmentValidator.ValidateDelete(id, response.Messages);

            if (response.Success)
            {
                await this._appointmentService.Delete(entity);
                response.Data = this._mapper.Map<Appointment, GetAppointmentDTO>(entity);
                response.Messages.Add("Cita borrada correctamente");
            }
            return response;
        }
    }
}
