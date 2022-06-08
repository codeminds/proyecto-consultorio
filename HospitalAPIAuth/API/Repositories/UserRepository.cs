global using IUserRepository = API.Repositories.IRepository<API.Data.Models.User, int>;

using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class UserRepository : Repository<User, int>
    {
        public UserRepository(HospitalDB database) : base(database, (u, id) => u.Id == id)
        {}
    }
}
