using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IUserService
    {
        IQueryable<User> ListUsers(UserListFilter? filter = null);
        Task InsertUser(User entity);
        Task<User?> FindUser(string email);
        Task<User?> FindUser(int id);
        Task UpdateUser(User entity);
        Task DeleteUser(User entity);
    }
}
