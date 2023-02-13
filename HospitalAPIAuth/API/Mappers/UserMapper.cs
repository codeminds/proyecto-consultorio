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
               opt.MapFrom((source, dest) => dest.PasswordSalt ?? Crypter.GetRandomSalt());
               opt.SetMappingOrder(0);
            })
            .ForMember(dest => dest.Password, opt =>
            {
               opt.MapFrom((source, dest) => Crypter.Hash(source.NewPassword!, dest.PasswordSalt));
               opt.SetMappingOrder(1);
            });
         CreateMap<UpdateSelfUserDTO, User>()
            .ForMember(dest => dest.Password, opt =>
            {
               opt.MapFrom((source, dest) =>
               {
                  return string.IsNullOrWhiteSpace(source.NewPassword)
                     ? dest.Password : Crypter.Hash(source.NewPassword, dest.PasswordSalt);
               });
            });
         CreateMap<FilterUserDTO, UserListFilter>();
      }
   }
}