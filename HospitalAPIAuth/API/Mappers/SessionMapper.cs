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
            CreateMap<Session, GetSessionTokensDTO>()
                .ForMember(t => t.AccessToken, opt => opt.MapFrom(s => s.AccessTokenString))
                .ForMember(t => t.RefreshToken, opt => opt.MapFrom(a => a.RefreshTokenString));
        }
    }
}
