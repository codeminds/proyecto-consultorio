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

        public async Task<List<User>> List(FilterUserDTO? filter = null)
        {
            filter = filter ?? new FilterUserDTO();

            return await this._database.User
                                        .Include(d => d.Role)
                                        .Where(p => (string.IsNullOrWhiteSpace(filter.Email) || p.Email.Contains(filter.Email))
                                                    && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                                                    && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                                                    && (!filter.RoleId.HasValue || p.RoleId == filter.RoleId))
                                        .ToListAsync();
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
