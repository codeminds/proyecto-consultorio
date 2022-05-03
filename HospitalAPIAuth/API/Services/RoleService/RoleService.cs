using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            this._roleRepository = roleRepository;
        }

        public async Task<List<Role>> ListRoles()
        {
            return await this._roleRepository
                                    .Query
                                    .ToListAsync();
        }
    }
}
