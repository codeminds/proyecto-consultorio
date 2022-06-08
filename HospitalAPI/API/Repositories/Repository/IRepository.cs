using System.Linq.Expressions;

namespace API.Repositories
{
    public interface IRepository<T, I> where T : class where I : struct
    {
        IQueryable<T> Query { get; }
        IQueryable<T> Find(I id);
        IQueryable<T> Search(IEnumerable<string> values, Func<string, Expression<Func<T, bool>>> where, IEnumerable<Expression<Func<T, object>>>? includes = null, IEnumerable<Expression<Func<T, object>>>? orderBys = null);
        void Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}