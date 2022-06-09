using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class RoleRepository : Repository<Role, int>, IRoleRepository
    {
        public RoleRepository(HospitalDB database) : base(database)
        { }

        public override IQueryable<Role> Find(int id)
        {
            return this.Query.Where(r => r.Id == id);
        }
    }
}