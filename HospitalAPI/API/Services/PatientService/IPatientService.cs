using API.Data.Models;
using API.DataTransferObjects;

namespace API.Services
{
    public interface IPatientService
    {
        Task<List<Patient>> List(FilterPatientDTO? filter);
        Task<List<Patient>> Search(string[] values);
        Task<Patient?> Get(int id);
        Task<int> Insert(Patient entity);
        Task Update(Patient entity);
        Task Delete(Patient entity);
    }
}
