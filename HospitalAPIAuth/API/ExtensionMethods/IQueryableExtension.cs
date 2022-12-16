using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

//IMPORTANTE: Sólo para proyecto Angular
namespace API.ExtensionMethods
{
    public static class IQueryableExtension
    {
        public static IQueryable<T> Search<T>(this IQueryable<T> queryable, IEnumerable<string> values, Func<string, Expression<Func<T, bool>>> where, IEnumerable<Expression<Func<T, object>>>? includes = null, IEnumerable<Expression<Func<T, object>>>? orderBys = null) where T : class
        {
            IQueryable<T> query = queryable;
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
                    IQueryable<T> unionQuery = queryable.Where(where(values.ElementAt(i)));

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
    }
}
