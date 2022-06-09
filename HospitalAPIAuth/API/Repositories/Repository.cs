using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Repositories
{
    public abstract class Repository<T, I>  where T : class where I : struct
    {
        public IQueryable<T> Query
        {
            get { return this._database.Set<T>(); }
        }

        private readonly DbContext _database;

        public Repository(DbContext database)
        {
            _database = database;
        }

        public abstract IQueryable<T> Find(I id);

        public IQueryable<T> Search(IEnumerable<string> values, Func<string, Expression<Func<T, bool>>> where, IEnumerable<Expression<Func<T, object>>>? includes = null, IEnumerable<Expression<Func<T, object>>>? orderBys = null)
        {
            IQueryable<T> query = this.Query;
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
                    IQueryable<T> unionQuery = this.Query.Where(where(values.ElementAt(i)));

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
            this._database.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            this._database.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            this._database.Set<T>().Remove(entity);
        }
    }
}
