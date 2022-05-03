using API.Data.Models;

namespace API.Repositories
{
    public interface IUserRepository
    {
        IQueryable<User> Query { get; }
        IQueryable<User> Find(int id);
        IQueryable<User> Search(IEnumerable<string> values);
        void Insert(User entity);
        void Update(User entity);
        void Delete(User entity);
    }
}
