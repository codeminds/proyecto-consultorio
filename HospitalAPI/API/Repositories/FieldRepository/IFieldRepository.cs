using API.Data.Models;
using System.Linq.Expressions;

namespace API.Repositories
{
    public interface IFieldRepository
    {
        IQueryable<Field> Find(int id);
        IQueryable<Field> Query(Expression<Func<Field, bool>>? filter = null);
        IQueryable<Field> Search(IEnumerable<string> values);
        void Insert(Field entity);
        void Update(Field entity);
        void Delete(Field entity);
    }
}
