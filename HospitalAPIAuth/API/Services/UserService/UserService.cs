using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserService : IUserService
    {
        private readonly HospitalDB _database;

        public UserService(HospitalDB database)
        {
            this._database = database;
        }

        public async Task<User?> Get(int id)
        {
            return await this._database.User
                                    .Include(d => d.Role)
                                    .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<User?> Get(string email)
        {
            return await this._database.User
                                    .Include(d => d.Role)
                                    .FirstOrDefaultAsync(d => d.Email == email);
        }

        public async Task Update(User entity)
        {
            this._database.User.Update(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
