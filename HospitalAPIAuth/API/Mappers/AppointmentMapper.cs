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
            CreateMap<FilterAppointmentDTO, PatientListFilter>()
                .ForMember(d => d.DocumentId, opt => opt.MapFrom(a => a.PatientDocumentId))
                .ForMember(d => d.FirstName, opt => opt.MapFrom(a => a.PatientFirstName))
                .ForMember(d => d.LastName, opt => opt.MapFrom(a => a.PatientLastName))
                .ForMember(d => d.BirthDateFrom, opt => opt.MapFrom(a => a.PatientBirthDateFrom))
                .ForMember(d => d.BirthDateTo, opt => opt.MapFrom(a => a.PatientBirthDateTo))
                .ForMember(d => d.Gender, opt => opt.MapFrom(a => a.PatientGender));
            CreateMap<FilterAppointmentDTO, DoctorListFilter>()
                .ForMember(d => d.DocumentId, opt => opt.MapFrom(a => a.DoctorDocumentId))
                .ForMember(d => d.FirstName, opt => opt.MapFrom(a => a.DoctorFirstName))
                .ForMember(d => d.LastName, opt => opt.MapFrom(a => a.DoctorLastName))
                .ForMember(d => d.FieldId, opt => opt.MapFrom(a => a.DoctorFieldId));
        }
    }
}