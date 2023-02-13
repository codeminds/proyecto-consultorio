using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
   public class GenderMapper : Profile
   {
      public GenderMapper()
      {
         CreateMap<Gender, GetGenderDTO>();
      }                                       
   }
}
