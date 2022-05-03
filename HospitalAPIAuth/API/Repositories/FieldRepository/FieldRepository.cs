using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace API.Repositories
{
    public class FieldRepository : IFieldRepository
    {
        public IQueryable<Field> Query
        {
            get { return this._database.Field; }
        }

        private readonly HospitalDB _database;

        public FieldRepository(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Field> Find(int id)
        {
            return this._database.Field.Where(p => p.Id == id);
        }

        public IQueryable<Field> Search(IEnumerable<string> values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT * FROM Field WHERE ");

            int items = values.Count();
            for (int i = 0; i < items; i++)
            {
                string value = values.ElementAt(i);
                queryString.Append($"Name LIKE '%{value}%' ");

                if (i < items - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return this._database.Field.FromSqlRaw(queryString.ToString());
        }

        public void Insert(Field entity)
        {
            this._database.Field.Add(entity);
        }

        public void Update(Field entity)
        {
            this._database.Field.Update(entity);
        }

        public void Delete(Field entity)
        {
            this._database.Field.Remove(entity);
        }
    }
}
