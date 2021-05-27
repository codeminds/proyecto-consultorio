using API.Data.Models;
using AutoMapper;
using API.DataTransferObjects;

namespace API.Mappers
{
    public class AppointmentMapper : Profile
    {
        public AppointmentMapper()
        {
            CreateMap<Appointment, GetAppointmentDTO>();
            CreateMap<CreateUpdateAppointmentDTO, Appointment>();
        }
    }
}
