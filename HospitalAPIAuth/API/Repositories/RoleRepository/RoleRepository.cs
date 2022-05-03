using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text;

namespace API.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        public IQueryable<Role> Query
        {
            get { return this._database.Role; }
        }

        private readonly HospitalDB _database;

        public RoleRepository(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Role> Find(int id)
        {
            return this._database.Role.Where(p => p.Id == id);
        }

        public IQueryable<Role> Search(IEnumerable<string> values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT * FROM Role WHERE ");

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

            return this._database.Role.FromSqlRaw(queryString.ToString());
        }

        public void Insert(Role entity)
        {
            this._database.Role.Add(entity);
        }

        public void Update(Role entity)
        {
            this._database.Role.Update(entity);
        }

        public void Delete(Role entity)
        {
            this._database.Role.Remove(entity);
        }
    }
}
