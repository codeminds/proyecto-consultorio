using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
    public class StatusMapper : Profile
    {
        public StatusMapper()
        {
            CreateMap<Status, GetStatusDTO>();
        }
    }
}