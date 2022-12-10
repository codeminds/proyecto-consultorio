using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
    public class AppointmentMapper : Profile
    {
        public AppointmentMapper()
        {
            CreateMap<Appointment, GetAppointmentDTO>();
            CreateMap<CreateUpdateAppointmentDTO, Appointment>();
            CreateMap<FilterAppointmentDTO, AppointmentListFilter>();    
        }
    }
}