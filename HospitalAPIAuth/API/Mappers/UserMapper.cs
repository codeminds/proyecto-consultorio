using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using API.Utils;
using AutoMapper;

namespace API.Mappers
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<User, GetUserDTO>();
            CreateMap<InsertUserDTO, User>()
                .ForMember(u => u.Password, opt => opt.MapFrom((up, u) => Crypter.Hash(up.Password!, Crypter.GetRandomSalt())));;
            CreateMap<UpdateUserInfoDTO, User>();
            CreateMap<UpdateUserEmailDTO, User>();
            CreateMap<FilterUserDTO, UserListFilter>();
            CreateMap<UpdateUserPasswordDTO, User>()
               .ForMember(u => u.Password, opt => opt.MapFrom((up, u) => Crypter.Hash(up.Password!, u.PasswordSalt)));
        }
    }
}