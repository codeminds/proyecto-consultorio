﻿using API.Data.Filters;
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
         CreateMap<InsertUpdateDoctorDTO, Doctor>();
         CreateMap<FilterDoctorDTO, DoctorListFilter>();
      }
   }
}
