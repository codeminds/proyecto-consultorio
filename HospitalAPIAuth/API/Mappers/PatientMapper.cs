using API.Data.Filters;
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
         CreateMap<InsertUpdatePatientDTO, Patient>();
         CreateMap<FilterPatientDTO, PatientListFilter>();
      }
   }
}
