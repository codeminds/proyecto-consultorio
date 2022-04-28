﻿using API.Data.Models;
using API.DataTransferObjects;

namespace API.Services
{
    public interface IUserService
    {
        Task<List<User>> List(FilterUserDTO? filter);
        Task<User?> Get(int id);
        Task<User?> Get(string email);
        Task Update(User entity);
    }
}