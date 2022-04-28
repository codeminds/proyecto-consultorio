using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class RoleService : IRoleService
    {
        private readonly HospitalDB _database;

        public RoleService(HospitalDB database)
        {
            this._database = database;
        }

        public async Task<List<Role>> List()
        {
            return await this._database.Role.ToListAsync();
        }

        public async Task<Role?> Get(int id)
        {
            return await this._database.Role
                     .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}
