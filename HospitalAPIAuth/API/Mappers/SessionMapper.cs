﻿using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;

namespace API.Mappers
{
    public class SessionMapper : Profile
    {
        public SessionMapper()
        {
            CreateMap<Session, GetSessionDTO>();
        }
    }
}
