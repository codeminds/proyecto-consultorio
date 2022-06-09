using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class FieldRepository : Repository<Field, int>, IFieldRepository
    {
        public FieldRepository(HospitalDB database) : base(database)
        { }

        public override IQueryable<Field> Find(int id)
        {
            return this.Query.Where(f => f.Id == id);
        }
    }
}