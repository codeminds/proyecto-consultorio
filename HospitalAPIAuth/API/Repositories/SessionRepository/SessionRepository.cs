using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace API.Repositories
{
    public class SessionRepository : ISessionRepository
    {
        public IQueryable<Session> Query
        {
            get { return this._database.Session; }
        }

        private readonly HospitalDB _database;

        public SessionRepository(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Session> Find(Guid sessionId)
        {
            return this._database.Session.Where(p => p.SessionId == sessionId);
        }

        public IQueryable<Session> Search(IEnumerable<string> values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT * FROM Session WHERE ");

            int items = values.Count();
            for (int i = 0; i < items; i++)
            {
                string value = values.ElementAt(i);
                queryString.Append($"SessionId LIKE '%{value}%' OR AddressIssued LIKE '%{value}%' OR AddressRefreshed LIKE '%{value}%' ");

                if (i < items - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return this._database.Session.FromSqlRaw(queryString.ToString());
        }

        public void Insert(Session entity)
        {
            this._database.Session.Add(entity);
        }

        public void Update(Session entity)
        {
            this._database.Session.Update(entity);
        }

        public void Delete(Session entity)
        {
            this._database.Session.Remove(entity);
        }
    }
}
