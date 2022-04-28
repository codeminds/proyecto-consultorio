using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;

namespace API.Services.PatientService
{
    public class PatientService : IPatientService
    {
        private readonly HospitalDB _database;

        public PatientService(HospitalDB database)
        {
            this._database = database;
        }

        public async Task<List<Patient>> List(FilterPatientDTO? filter = null)
        {
            filter = filter ?? new FilterPatientDTO();

            return await this._database.Patient
                                        .Where(p => (string.IsNullOrWhiteSpace(filter.DocumentId) || p.DocumentId.Contains(filter.DocumentId))
                                                    && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                                                    && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                                                    && (!filter.BirthDateFrom.HasValue || p.BirthDate >= filter.BirthDateFrom)
                                                    && (!filter.BirthDateTo.HasValue || p.BirthDate <= filter.BirthDateTo)
                                                    && (!filter.Gender.HasValue || p.Gender == filter.Gender))
                                        .ToListAsync();
        }

        public async Task<List<Patient>> Search(string[] values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT * FROM Patient WHERE ");
            List<SqlParameter> parameters = new List<SqlParameter>();
            Regex regex = new Regex(@"[^\d\w ]", RegexOptions.IgnoreCase);

            for (int i = 0; i < values.Length; i++)
            {
                string value = regex.Replace(values[i], "");
                queryString.Append($"DocumentId LIKE '%{value}%' OR FirstName LIKE '%{value}%' OR LastName LIKE '%{value}%' ");

                if (i < values.Length - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return await this._database.Patient
                                        .FromSqlRaw(queryString.ToString())
                                        .ToListAsync();
        }

        public async Task<Patient?> Get(int id)
        {
            return await this._database.Patient
                                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<int> Insert(Patient entity)
        {
            this._database.Patient.Add(entity);
            await this._database.SaveChangesAsync();

            return entity.Id;
        }

        public async Task Update(Patient entity)
        {
            this._database.Patient.Update(entity);
            await this._database.SaveChangesAsync();

        }

        public async Task Delete(Patient entity)
        {
            this._database.Patient.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
