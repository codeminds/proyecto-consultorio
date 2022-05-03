using API.Data.Models;

namespace API.Repositories
{
    public interface ISessionRepository
    {
        IQueryable<Session> Query { get; }
        IQueryable<Session> Find(Guid sessionId);
        IQueryable<Session> Search(IEnumerable<string> values);
        void Insert(Session entity);
        void Update(Session entity);
        void Delete(Session entity);
    }
}
