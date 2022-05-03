using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace API.Repositories
{
    public class UserRepository : IUserRepository
    {
        public IQueryable<User> Query
        {
            get { return this._database.User; }
        }

        private readonly HospitalDB _database;

        public UserRepository(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<User> Find(int id)
        {
            return this._database.User.Where(p => p.Id == id);
        }

        public IQueryable<User> Search(IEnumerable<string> values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT * FROM User WHERE ");

            int items = values.Count();
            for (int i = 0; i < items; i++)
            {
                string value = values.ElementAt(i);
                queryString.Append($"Email LIKE '%{value}%' OR FirstName LIKE '%{value}%' OR LastName LIKE '%{value}%' ");

                if (i < items - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return this._database.User.FromSqlRaw(queryString.ToString());
        }

        public void Insert(User entity)
        {
            this._database.User.Add(entity);
        }

        public void Update(User entity)
        {
            this._database.User.Update(entity);
        }

        public void Delete(User entity)
        {
            this._database.User.Remove(entity);
        }
    }
}
