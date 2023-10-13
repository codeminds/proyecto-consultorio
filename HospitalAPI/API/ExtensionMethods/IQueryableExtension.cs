using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

//IMPORTANTE: Sólo para proyecto Angular
namespace API.ExtensionMethods
{
    public static class IQueryableExtension
    {
        //Función de búsqueda sobre una entidad por términos de búsqueda proporcionados en una lista.
        public static IQueryable<T> Search<T>(this IQueryable<T> queryable, IEnumerable<string> values, Func<string, Expression<Func<T, bool>>> where, IEnumerable<Expression<Func<T, object>>>? includes = null, IEnumerable<Expression<Func<T, object>>>? orderBys = null) where T : class
        {
            /* Creamos un objeto aparte con el queryable original para modificarlo
            pero teniendo siempre acceso al query original */
            IQueryable<T> query = queryable;

            /* Colecciones de expresiones lambda para incluir elementos complejos en queries 
            y para ordenamiento */
            includes ??= Enumerable.Empty<Expression<Func<T, object>>>();
            orderBys ??= Enumerable.Empty<Expression<Func<T, object>>>();

            int items = values.Count();
            if (items > 0)
            {

                /* Se crea un nuevo query con el filtro proporcionado en el parámetro lambda where */
                query = queryable.Where(where(values.ElementAt(0)));

                /* Se agregan los includes en el query */
                foreach (Expression<Func<T, object>> include in includes)
                {
                    query = query.Include(include);
                }

                /* Se repite lo anterior por cada item de búsqueda en la lista de términos y se une al query */
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

            /* Se itera sobre la lista de expresiones de ordenamiento para agregar al final del query */
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