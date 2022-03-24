using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;

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

        public async Task<List<GetDoctorDTO>> List(FilterDoctorDTO filter)
        {
            return await this._database.Doctor
                                        .Include(d => d.Field)
                                        .Where(p => (string.IsNullOrWhiteSpace(filter.DocumentId) || p.DocumentId.Contains(filter.DocumentId))
                                                    && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                                                    && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                                                    && (!filter.FieldId.HasValue || p.FieldId == filter.FieldId))
                                        .Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d))
                                        .ToListAsync();
        }

        public async Task<List<GetDoctorDTO>> Search(string[] values)
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

            List<Doctor> results = await this._database.Doctor
                                    .FromSqlRaw(queryString.ToString())
                                    .Include(d => d.Field)
                                    .ToListAsync();

            return results.Select(d => this._mapper.Map<Doctor, GetDoctorDTO>(d)).ToList();
        }

        public async Task<GetDoctorDTO?> Get(int id)
        {
            Doctor? entity = await this._database.Doctor
                                    .Include(d => d.Field)
                                    .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null)
            {
                return null;
            }

            return this._mapper.Map<Doctor, GetDoctorDTO>(entity);
        }

        public async Task<GetDoctorDTO> Insert(CreateUpdateDoctorDTO data)
        {
            Doctor entity = this._mapper.Map<CreateUpdateDoctorDTO, Doctor>(data);
            

            this._database.Doctor.Add(entity);
            await this._database.SaveChangesAsync();

            entity = await this._database.Doctor
                                    .Include(d => d.Field)
                                    .FirstOrDefaultAsync(d => d.Id == entity.Id);
            return this._mapper.Map<Doctor, GetDoctorDTO>(entity);
        }

        public async Task<GetDoctorDTO?> Update(int id, CreateUpdateDoctorDTO data)
        {
            Doctor? entity = await this._database.Doctor
                                                    .Include(d => d.Field)
                                                    .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null)
            {
                return null;
            }

            this._mapper.Map(data, entity);
            this._database.Doctor.Update(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Doctor?, GetDoctorDTO?>(entity);
        }

        public async Task<GetDoctorDTO?> Delete(int id)
        {
            Doctor? entity = await this._database.Doctor
                                                    .Include(d => d.Field)
                                                    .FirstOrDefaultAsync(d => d.Id == id); ;

            if (entity == null)
            {
                return null;
            }

            this._database.Doctor.Remove(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Doctor?, GetDoctorDTO?>(entity);
        }
    }
}
