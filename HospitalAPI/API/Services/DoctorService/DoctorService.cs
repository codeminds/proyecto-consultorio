using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace API.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly HospitalDB _database;
        private readonly IMapper _mapper;

        public DoctorService(HospitalDB database, IMapper mapper)
        {
            this._database = database;
            this._mapper = mapper;
        }

        public async Task<GetDoctorDTO> Get(int id)
        {
            Doctor entity = await this._database.Doctors
                                                    .Include(d => d.Field)
                                                    .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null) return null;

            return this._mapper.Map<Doctor, GetDoctorDTO>(entity);
        }

        public async Task<List<GetDoctorDTO>> List(FilterDoctorDTO filter)
        {
            return await this._database.Doctors
                                           .Include(d => d.Field)
                                           .Where(d => (string.IsNullOrWhiteSpace(filter.DocumentId) || d.DocumentId.Contains(filter.DocumentId))
                                                       && (string.IsNullOrWhiteSpace(filter.FirstName) || d.FirstName.Contains(filter.FirstName))
                                                       && (string.IsNullOrWhiteSpace(filter.LastName) || d.LastName.Contains(filter.LastName))
                                                       && (!filter.FieldId.HasValue || d.FieldId == filter.FieldId))
                                           .Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d))
                                           .ToListAsync();
        }

        public async Task<List<GetDoctorDTO>> Search(string[] values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT d.* FROM Doctor d INNER JOIN Field f ON f.Id = d.FieldID WHERE ");
            List<SqlParameter> parameters = new List<SqlParameter>();
            Regex regex = new Regex(@"[^\d\w ]", RegexOptions.IgnoreCase);

            for (int i = 0; i < values.Length; i++)
            {
                string paramName = $"search{i}";
                string value = regex.Replace(values[i], "");
                parameters.Add(new SqlParameter(paramName, value));
                queryString.Append($"d.DocumentId LIKE '%{value}%' OR d.LastName LIKE '%{value}%' OR d.FirstName LIKE '%{value}%' OR f.Name LIKE '%{value}%' ");

                if (i < values.Length - 1)
                {
                    queryString.Append("OR ");
                }
            }

            List<Doctor> results = await this._database.Doctors
                                .FromSqlRaw(queryString.ToString(), parameters.ToArray())
                                .Include(d => d.Field)
                                .ToListAsync();


            return results.Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d)).ToList();
        }

        public async Task<GetDoctorDTO> Insert(CreateUpdateDoctorDTO data)
        {
            Doctor entity = this._mapper.Map<CreateUpdateDoctorDTO, Doctor>(data);

            this._database.Doctors.Add(entity);
            await this._database.SaveChangesAsync();

            return await this.Get(entity.Id);
        }

        public async Task<GetDoctorDTO> Update(int id, CreateUpdateDoctorDTO data)
        {
            Doctor entity = await this._database.Doctors
                                                     .Include(d => d.Field)
                                                     .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null) return null;

            this._mapper.Map(data, entity);
            this._database.Doctors.Update(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Doctor, GetDoctorDTO>(entity);
        }

        public async Task<GetDoctorDTO> Delete(int id)
        {
            Doctor entity = await this._database.Doctors
                                                    .Include(d => d.Field)
                                                    .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null) return null;

            this._database.Doctors.Remove(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Doctor, GetDoctorDTO>(entity);
        }
    }
}
