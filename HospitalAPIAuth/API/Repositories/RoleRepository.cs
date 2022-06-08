global using IRoleRepository = API.Repositories.IRepository<API.Data.Models.Role, int>;

using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class RoleRepository : Repository<Role, int>
    {
        public RoleRepository(HospitalDB database) : base(database, (r, id) => r.Id == id)
        {}
    }
}
