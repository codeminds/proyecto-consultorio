using API.Data.Filters;
using API.Data.Models;
using System.Net;

namespace API.Services
{
    public interface ISessionService
    {
        Task<List<Session>> ListSessions(string username, SessionListFilter filter);
        Task<Session?> FindSession(Guid sessionId);
        Task<Session> CreateUserSession(User user, IPAddress? address);
        Task RefreshUserSession(User user, Session Session, IPAddress? address);
        Task DeleteSession(Session entity);
    }
}
