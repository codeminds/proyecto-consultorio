using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
   public class FieldMapper : Profile
   {
      public FieldMapper()
      {
         CreateMap<Field, GetFieldDTO>();
      }
   }
}
