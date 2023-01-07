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
        Task UpdateUser(User entity);
        Task DeleteUser(User entity);
    }
}
