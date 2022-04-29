using API.Data.Models;
using API.DataTransferObjects;

namespace API.Services
{
    public interface ISessionService
    {
        Task<List<Session>> List(int userId);
        Task<Session?> Get(Guid sessionId, string username);
        Task<long> Insert(Session entity);
        Task Update(Session entity);
        Task Delete(Session entity);
    }
}
