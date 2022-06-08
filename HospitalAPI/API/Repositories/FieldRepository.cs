global using IFieldRepository = API.Repositories.IRepository<API.Data.Models.Field, int>;

using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class FieldRepository : Repository<Field, int>
    {
        public FieldRepository(HospitalDB database) : base(database, (f, id) => f.Id == id)
        {}
    }
}
