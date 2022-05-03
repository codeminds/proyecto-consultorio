using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IPatientService
    {
        Task<List<Patient>> ListPatients(PatientListFilter? filter);
        Task<List<Patient>> SearchPatients(string[] values);
        Task<Patient?> FindPatient(int id);
        Task<Patient> CreatePatient(Patient patient);
        Task UpdatePatient(Patient Patient);
        Task DeletePatient(Patient entity);
    }
}
