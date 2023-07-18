using API.Data.Filters;
using API.Data.Models;
using System.Net;

namespace API.Services
{
    public interface ISessionService
    {
        IQueryable<Session> ListSessions(int userId, SessionFilters? filter = null);
        Task<Session?> FindSession(Guid sessionId);
        Task<Session> InitUserSession(User user, IPAddress? address);
        Task RefreshUserSession(User user, Session session, IPAddress? address);
        Task DeleteSession(Session entity);
    }
}
