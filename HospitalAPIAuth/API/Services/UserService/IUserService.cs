using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IUserService
    {
        Task<User?> FindUser(int id);
        Task<User?> FindUser(string email);
        Task UpdateUser(User User, bool expireSessions = false);
    }
}
