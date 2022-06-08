using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Repositories
{
    public class Repository<T, I> : IRepository<T, I> where T : class where I : struct
    {
        public IQueryable<T> Query
        {
            get { return _database.Set<T>(); }
        }

        private readonly Func<T, I, bool> _find;
        private readonly DbContext _database;

        public Repository(DbContext database, Func<T, I, bool> find)
        {
            _find = find;
            _database = database;
        }

        public virtual IQueryable<T> Find(I id)
        {
            return Query.Where(e => _find(e, id));
        }

        public IQueryable<T> Search(IEnumerable<string> values, Func<string, Expression<Func<T, bool>>> where, IEnumerable<Expression<Func<T, object>>>? includes = null, IEnumerable<Expression<Func<T, object>>>? orderBys = null)
        {
            IQueryable<T> query = Query;
            includes ??= Enumerable.Empty<Expression<Func<T, object>>>();
            orderBys ??= Enumerable.Empty<Expression<Func<T, object>>>();

            int items = values.Count();
            if (items > 0)
            {
                query = query.Where(where(values.ElementAt(0)));

                foreach (Expression<Func<T, object>> include in includes)
                {
                    query = query.Include(include);
                }

                for (int i = 1; i < items; i++)
                {
                    IQueryable<T> unionQuery = Query.Where(where(values.ElementAt(i)));

                    foreach (Expression<Func<T, object>> include in includes)
                    {
                        unionQuery = unionQuery.Include(include);
                    }

                    query = query.Union(unionQuery);
                }
            }

            int orderItems = orderBys.Count();
            if (orderItems > 0)
            {
               query = query.OrderBy(orderBys.ElementAt(0));

               for (int i = 1; i < orderItems; i++)
               {
                  query = ((IOrderedQueryable<T>)query).ThenBy(orderBys.ElementAt(i));
               }
            }

            return query;
        }

        public void Insert(T entity)
        {
            _database.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            _database.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _database.Set<T>().Remove(entity);
        }
    }
}
