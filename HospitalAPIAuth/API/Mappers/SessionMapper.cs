using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
   public class SessionMapper : Profile
   {
      public SessionMapper()
      {
         CreateMap<Session, GetSessionDTO>();
         /* Para mapeo de propiedades que varían en valores, se puede configurar manualmente */
         CreateMap<Session, GetSessionTokensDTO>()
             .ForMember(dest => dest.AccessToken, opt => opt.MapFrom(source => source.AccessTokenString))
             .ForMember(dest => dest.RefreshToken, opt => opt.MapFrom(source => source.RefreshTokenString));
         CreateMap<FilterSessionDTO, SessionFilters>();
      }
   }
}