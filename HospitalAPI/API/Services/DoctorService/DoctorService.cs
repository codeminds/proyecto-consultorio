using API.Data;
using API.Data.Filters;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly HospitalDB _database;

        public DoctorService(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Doctor> ListDoctors(DoctorListFilter? filter = null)
        {
            filter ??= new DoctorListFilter();

            return this._database
                    .Doctor
                    .Where(d => (string.IsNullOrWhiteSpace(filter.DocumentId) || d.DocumentId.Contains(filter.DocumentId))
                        && (string.IsNullOrWhiteSpace(filter.FirstName) || d.FirstName.Contains(filter.FirstName))
                        && (string.IsNullOrWhiteSpace(filter.LastName) || d.LastName.Contains(filter.LastName))
                        && (!filter.FieldId.HasValue || d.FieldId == filter.FieldId));
        }

        public async Task<Doctor?> FindDoctor(int id)
        {
            return await this._database
                            .Doctor
                            .Include(p => p.Field)
                            .Where(d => d.Id == id)
                            .FirstOrDefaultAsync();
        }

        public async Task InsertDoctor(Doctor entity)
        {
            this._database.Doctor.Add(entity);
            await this._database.SaveChangesAsync();
            await this._database.Entry(entity).Reference(d => d.Field).LoadAsync();
        }

        public async Task UpdateDoctor(Doctor entity)
        {
            this._database.Doctor.Update(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task DeleteDoctor(Doctor entity)
        {
            this._database.Doctor.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
