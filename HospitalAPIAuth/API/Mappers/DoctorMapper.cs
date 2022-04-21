using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
    public class DoctorMapper : Profile
    {
        public DoctorMapper()
        {
            CreateMap<Doctor, GetDoctorDTO>();
            CreateMap<CreateUpdateDoctorDTO, Doctor>();
            CreateMap<FilterAppointmentDTO, FilterDoctorDTO>()
                .ForMember(d => d.DocumentId , opt => opt.MapFrom(a => a.DoctorDocumentId))
                .ForMember(d => d.FirstName, opt => opt.MapFrom(a => a.DoctorFirstName))
                .ForMember(d => d.LastName, opt => opt.MapFrom(a => a.DoctorLastName))
                .ForMember(d => d.FieldId, opt => opt.MapFrom(a => a.DoctorFieldId));
        }
    }
}
