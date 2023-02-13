using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
   public class RoleMapper : Profile
   {
      public RoleMapper()
      {
         CreateMap<Role, GetRoleDTO>();
      }
   }
}