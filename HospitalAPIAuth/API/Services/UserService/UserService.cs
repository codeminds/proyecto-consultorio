using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API.Services
{
    public class UserService : IUserService
    {
        private readonly HospitalDB _database;
        private readonly IUserRepository _userRepository;

        public UserService(HospitalDB database, IUserRepository userRepository)
        {
            this._database = database;
            this._userRepository = userRepository;
        }

        public async Task<User?> FindUser(int id)
        {
            return await this._userRepository
                                .Find(id)
                                .FirstOrDefaultAsync();
        }

        public async Task<User?> FindUser(string email)
        {
            return await this._userRepository.Query
                                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task UpdateUser(User user)
        {
            this._userRepository.Update(user);
            await this._database.SaveChangesAsync();
        }
    }
}
