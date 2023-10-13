using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IPatientService
    {
        IQueryable<Patient> ListPatients(PatientListFilter? filter);
        //IMPORTANTE: Sólo para proyecto Angular
        IQueryable<Patient> SearchPatients(string[] values);
        Task<Patient?> FindPatient(int id);
        Task InsertPatient(Patient entity);
        Task UpdatePatient(Patient entity);
        Task DeletePatient(Patient entity);
    }
}