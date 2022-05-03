using API.Data.Models;
using System.Linq.Expressions;

namespace API.Repositories
{
    public interface IRoleRepository
    {
        IQueryable<Role> Query { get; }
        IQueryable<Role> Find(int id);
        IQueryable<Role> Search(IEnumerable<string> values);
        void Insert(Role entity);
        void Update(Role entity);
        void Delete(Role entity);
    }
}
