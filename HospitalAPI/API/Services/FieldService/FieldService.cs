using API.Data;
using API.Data.Models;

namespace API.Services
{
    public class FieldService : IFieldService
    {
        private readonly HospitalDB _database;

        public FieldService(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Field> ListFields()
        {
            return this._database
                    .Field;
        }
    }
}