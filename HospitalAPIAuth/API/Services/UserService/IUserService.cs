using API.Data.Models;

namespace API.Services
{
    public interface IUserService
    {
        Task<User?> FindUser(int id);
        Task<User?> FindUser(string email);
        Task UpdateUser(User user, bool expireSessions = false);
        Task UpdateUserInfo(User user);
        Task UpdateUserEmail(User user);
        Task UpdateUserPassword(User user);
    }
}
