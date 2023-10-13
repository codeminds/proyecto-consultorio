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
            CreateMap<InsertUpdateUserDTO, User>()
                .ForMember(dest => dest.PasswordSalt, opt =>
                {
                    opt.MapFrom((source, dest) => dest.PasswordSalt ?? Crypter.GetRandomSalt(Configuration.Get<int>("Cryptography:SaltLength")));
                    opt.SetMappingOrder(0);
                })
                .ForMember(dest => dest.Password, opt =>
                {
                    opt.MapFrom((source, dest) => string.IsNullOrWhiteSpace(source.NewPassword) ?
                                    dest.Password : Crypter.Hash(source.NewPassword, dest.PasswordSalt, Configuration.Get<int>("Cryptography:SaltLength")));
                    opt.SetMappingOrder(1);
                });
            CreateMap<UpdateSelfUserDTO, User>()
                .ForMember(dest => dest.Password, opt =>
                {
                    opt.MapFrom((source, dest) => string.IsNullOrWhiteSpace(source.NewPassword) ?
                                    dest.Password : Crypter.Hash(source.NewPassword, dest.PasswordSalt, Configuration.Get<int>("Cryptography:SaltLength")));
                });
            CreateMap<FilterUserDTO, UserListFilter>();
        }
    }
}