using API.Data;
using API.Data.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;

namespace API.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly HospitalDB _database;

        public AppointmentRepository(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Appointment> Find(int id)
        {
            return this._database.Appointment.Where(p => p.Id == id);
        }

        public IQueryable<Appointment> Query(Expression<Func<Appointment, bool>>? filter = null)
        {
            if (filter == null)
            {
                return this._database.Appointment;
            }

            return this._database.Appointment.Where(filter);
        }

        public IQueryable<Appointment> Search(IEnumerable<string> values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT * FROM Appointment a INNER JOIN Patient p ON p.Id = a.PatientId INNER JOIN Doctor d ON d.Id = a.DoctorId WHERE ");

            int items = values.Count();
            for (int i = 0; i < items; i++)
            {
                string value = values.ElementAt(i);
                queryString.Append($"p.DocumentId LIKE '%{value}%' OR p.FirstName LIKE '%{value}%' OR p.LastName LIKE '%{value}%' ");
                queryString.Append($"OR d.DocumentId LIKE '%{value}%' OR d.FirstName LIKE '%{value}%' OR d.LastName LIKE '%{value}%' ");

                if (i < items - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return this._database.Appointment.FromSqlRaw(queryString.ToString());
        }

        public void Insert(Appointment entity)
        {
            this._database.Appointment.Add(entity);
        }

        public void Update(Appointment entity)
        {
            this._database.Appointment.Update(entity);
        }

        public void Delete(Appointment entity)
        {
            this._database.Appointment.Remove(entity);
        }
    }
}
