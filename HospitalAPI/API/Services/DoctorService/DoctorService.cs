using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;

namespace API.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly HospitalDB _database;

        public DoctorService(HospitalDB database)
        {
            this._database = database;
        }

        public async Task<List<Doctor>> List(FilterDoctorDTO? filter = null)
        {
            filter = filter ?? new FilterDoctorDTO();

            return await this._database.Doctor
                                        .Include(d => d.Field)
                                        .Where(p => (string.IsNullOrWhiteSpace(filter.DocumentId) || p.DocumentId.Contains(filter.DocumentId))
                                                    && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                                                    && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                                                    && (!filter.FieldId.HasValue || p.FieldId == filter.FieldId))
                                        .ToListAsync();
        }

        public async Task<List<Doctor>> Search(string[] values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT d.* FROM Doctor d INNER JOIN Field f ON f.Id = d.FieldId WHERE ");
            List<SqlParameter> parameters = new List<SqlParameter>();
            Regex regex = new Regex(@"[^\d\w ]", RegexOptions.IgnoreCase);

            for (int i = 0; i < values.Length; i++)
            {
                string value = regex.Replace(values[i], "");
                queryString.Append($"d.DocumentId LIKE '%{value}%' OR d.FirstName LIKE '%{value}%' OR d.LastName LIKE '%{value}%' OR f.Name LIKE '%{value}%' ");

                if (i < values.Length - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return await this._database.Doctor
                                    .FromSqlRaw(queryString.ToString())
                                    .Include(d => d.Field)
                                    .ToListAsync();
        }

        public async Task<Doctor?> Get(int id)
        {
            return await this._database.Doctor
                                    .Include(d => d.Field)
                                    .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<int> Insert(Doctor entity)
        {
            this._database.Doctor.Add(entity);
            await this._database.SaveChangesAsync();

            return entity.Id;
        }

        public async Task Update(Doctor entity)
        {
            this._database.Doctor.Update(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task Delete(Doctor entity)
        {
            this._database.Doctor.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
