using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class UserRepository : Repository<User, int>, IUserRepository
    {
        public UserRepository(HospitalDB database) : base(database)
        { }

        public override IQueryable<User> Find(int id)
        {
            return this.Query.Where(s => s.Id == id);
        }
    }
}