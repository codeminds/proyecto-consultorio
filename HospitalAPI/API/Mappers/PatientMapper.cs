using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
    public class PatientMapper : Profile
    {
        public PatientMapper()
        {
            CreateMap<Patient, GetPatientDTO>();
            CreateMap<CreateUpdatePatientDTO, Patient>();
            CreateMap<FilterAppointmentDTO, FilterPatientDTO>()
                .ForMember(d => d.DocumentId, opt => opt.MapFrom(a => a.DoctorDocumentId))
                .ForMember(d => d.FirstName, opt => opt.MapFrom(a => a.DoctorFirstName))
                .ForMember(d => d.LastName, opt => opt.MapFrom(a => a.DoctorLastName))
                .ForMember(d => d.BirthDateFrom, opt => opt.MapFrom(a => a.PatientBirthDateFrom))
                .ForMember(d => d.BirthDateTo, opt => opt.MapFrom(a => a.PatientBirthDateTo))
                .ForMember(d => d.Gender, opt => opt.MapFrom(a => a.PatientGender));
        }
    }
}
