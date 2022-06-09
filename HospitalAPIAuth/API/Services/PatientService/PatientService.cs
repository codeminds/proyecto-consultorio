using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Services
{
    public class PatientService : Service, IPatientService
    {
        private readonly IPatientRepository _patientRepository;

        public PatientService(HospitalDB database, IPatientRepository patientRepository) : base(database)
        {
            this._patientRepository = patientRepository;
        }

        public async Task<List<Patient>> ListPatients(PatientListFilter? filter = null)
        {
            filter ??= new PatientListFilter();

            return await this._patientRepository
                                    .List(filter)
                                    .ToListAsync();
        }

        public async Task<List<Patient>> SearchPatients(string[] values)
        {
            return await this._patientRepository
                                    .Search(values,
                                            (value) => (patient) => patient.DocumentId.Contains(value)
                                                || patient.FirstName.Contains(value)
                                                || patient.LastName.Contains(value),
                                            orderBys: new List<Expression<Func<Patient, object>>> 
                                            {
                                                patient => patient.DocumentId,
                                                patient => patient.FirstName,
                                                patient => patient.LastName
                                            }
                                    )
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
            await this.SaveRepositoriesAsync();

            return patient;
        }

        public async Task UpdatePatient(Patient patient)
        {
            this._patientRepository.Update(patient);
            await this.SaveRepositoriesAsync();
        }

        public async Task DeletePatient(Patient patient)
        {
            this._patientRepository.Delete(patient);
            await this.SaveRepositoriesAsync();
        }
    }
}
