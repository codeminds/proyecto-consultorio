using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IUserService
    {
        IQueryable<User> ListUsers(UserListFilter? filter);
        Task<User?> FindUser(int id);
        Task<User?> FindUser(string email);
        Task InsertUser(User entity);
        Task UpdateUserInfo(User entity);
        Task UpdateUserEmail(User entity);
        Task UpdateUserPassword(User entity);
        Task DeleteUser(User entity);
    }
}
