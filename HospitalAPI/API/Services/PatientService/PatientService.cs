using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API.Services
{
    public class PatientService : IPatientService
    {
        private readonly HospitalDB _database;
        private readonly IPatientRepository _patientRepository;

        public PatientService(HospitalDB database, IPatientRepository patientRepository)
        {
            this._database = database;
            this._patientRepository = patientRepository;
        }

        public async Task<List<Patient>> ListPatients(PatientListFilter? filter = null)
        {
            filter = filter ?? new PatientListFilter();

            return await this._patientRepository.Query
                                    .Where(p => (string.IsNullOrWhiteSpace(filter.DocumentId) || p.DocumentId.Contains(filter.DocumentId))
                                                    && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                                                    && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                                                    && (!filter.BirthDateFrom.HasValue || p.BirthDate >= filter.BirthDateFrom)
                                                    && (!filter.BirthDateTo.HasValue || p.BirthDate <= filter.BirthDateTo)
                                                    && (!filter.Gender.HasValue || p.Gender == filter.Gender))
                                    .ToListAsync();
        }

        public async Task<List<Patient>> SearchPatients(string[] values)
        {
            //Lo valores pueden tener caracteres especiales que pueden contener
            //inyecciones de SQL, por lo que por medio de expresiones regulares
            //creamos un regla para remover caracteres extraños de los valores
            Regex regex = new Regex(@"[^\d\w ]", RegexOptions.IgnoreCase);

            return await this._patientRepository
                                    .Search(values.Select(v => regex.Replace(v, "")))
                                    .ToListAsync();
        }

        public async Task<Patient?> FindPatient(int id)
        {
            return await this._patientRepository
                                .Find(id)
                                .FirstOrDefaultAsync();
        }

        public async Task<Patient> CreatePatient(Patient patient)
        {
            this._patientRepository.Insert(patient);
            await this._database.SaveChangesAsync();

            return (await this._patientRepository
                                        .Find(patient.Id)
                                        .FirstOrDefaultAsync())!;
        }

        public async Task UpdatePatient(Patient patient)
        {
            this._patientRepository.Update(patient);
            await this._database.SaveChangesAsync();
        }

        public async Task DeletePatient(Patient patient)
        {
            this._patientRepository.Delete(patient);
            await this._database.SaveChangesAsync();
        }
    }
}
