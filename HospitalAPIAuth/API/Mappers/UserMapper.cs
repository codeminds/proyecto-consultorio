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
            CreateMap<InsertUpdateUserDTO, User>();
            CreateMap<UpdateSelfUserDTO, User>();
            CreateMap<FilterUserDTO, UserListFilter>();
        }
    }
}