using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Mappers
{
    public class PatientMapper : Profile
    {
        public PatientMapper()
        {
            CreateMap<Patient, GetPatientDTO>();
            CreateMap<CreateUpdatePatientDTO, Patient>();
        }
    }
}
