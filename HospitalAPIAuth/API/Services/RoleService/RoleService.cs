using API.Data;
using API.Data.Models;

namespace API.Services
{
    public class RoleService : IRoleService
    {
        private readonly HospitalDB _database;

        public RoleService(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Role> ListRoles()
        {
            return this._database
                        .Role;
        }
    }
}