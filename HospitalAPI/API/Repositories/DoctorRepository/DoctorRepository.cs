using API.Data;
using API.Data.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;

namespace API.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly HospitalDB _database;

        public DoctorRepository(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Doctor> Find(int id)
        {
            return this._database.Doctor.Where(p => p.Id == id);
        }

        public IQueryable<Doctor> Query(Expression<Func<Doctor, bool>>? filter = null)
        {
            if (filter == null)
            {
                return this._database.Doctor;
            }

            return this._database.Doctor.Where(filter);
        }

        public IQueryable<Doctor> Search(IEnumerable<string> values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT d.* FROM Doctor d INNER JOIN Field f ON f.Id = d.FieldId WHERE ");

            int items = values.Count();
            for (int i = 0; i < items; i++)
            {
                string value = values.ElementAt(i);
                queryString.Append($"d.DocumentId LIKE '%{value}%' OR d.FirstName LIKE '%{value}%' OR d.LastName LIKE '%{value}%' OR f.Name LIKE '%{value}%' ");

                if (i < items - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return this._database.Doctor.FromSqlRaw(queryString.ToString());
        }

        public void Insert(Doctor entity)
        {
            this._database.Doctor.Add(entity);
        }

        public void Update(Doctor entity)
        {
            this._database.Doctor.Update(entity);
        }

        public void Delete(Doctor entity)
        {
            this._database.Doctor.Remove(entity);
        }
    }
}
