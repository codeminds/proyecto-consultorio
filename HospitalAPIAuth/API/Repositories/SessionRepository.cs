global using ISessionRepository = API.Repositories.IRepository<API.Data.Models.Session, int>;

using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class SessionRepository : Repository<Session, int>
    {
        public SessionRepository(HospitalDB database) : base(database, (s, id) => s.Id == id)
        {}
    }
}
