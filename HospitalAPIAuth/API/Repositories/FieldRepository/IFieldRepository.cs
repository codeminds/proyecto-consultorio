using API.Data.Models;

namespace API.Repositories
{
    public interface IFieldRepository
    {
        IQueryable<Field> Query { get; }
        IQueryable<Field> Find(int id);
        IQueryable<Field> Search(IEnumerable<string> values);
        void Insert(Field entity);
        void Update(Field entity);
        void Delete(Field entity);
    }
}
