using API.Data;
using API.Data.Filters;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class PatientService : IPatientService
    {
        private readonly HospitalDB _database;

        public PatientService(HospitalDB database)
        {
            this._database = database;
            
        }

        public IQueryable<Patient> ListPatients(PatientListFilter? filter = null)
        {
            filter ??= new PatientListFilter();

            return this._database
                    .Patient
                    .Where(p => (string.IsNullOrWhiteSpace(filter.DocumentId) || p.DocumentId.Contains(filter.DocumentId))
                        && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                        && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                        && (!filter.BirthDateFrom.HasValue || p.BirthDate >= filter.BirthDateFrom)
                        && (!filter.BirthDateTo.HasValue || p.BirthDate <= filter.BirthDateTo)
                        && (!filter.GenderId.HasValue || p.GenderId == filter.GenderId));
        }

        public async Task<Patient?> FindPatient(int id)
        {
            return await this._database
                            .Patient
                            .Include(p => p.Gender)
                            .Where(p => p.Id == id)
                            .FirstOrDefaultAsync();
        }

        public async Task InsertPatient(Patient entity)
        {
            this._database.Patient.Add(entity);
            await this._database.SaveChangesAsync();
            await this._database.Entry(entity).Reference(p => p.Gender).LoadAsync();
        }

        public async Task UpdatePatient(Patient entity)
        {
            this._database.Patient.Update(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task DeletePatient(Patient entity)
        {
            this._database.Patient.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
