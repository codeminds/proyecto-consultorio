using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class SessionRepository : Repository<Session, int>, ISessionRepository
    {
        public SessionRepository(HospitalDB database) : base(database)
        { }

        public override IQueryable<Session> Find(int id)
        {
            return this.Query.Where(s => s.Id == id);
        }
    }
}