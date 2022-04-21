using API.Data.Models;
using API.DataTransferObjects;

namespace API.Services
{
    public interface IDoctorService
    {
        Task<List<Doctor>> List(FilterDoctorDTO? filter);
        Task<List<Doctor>> Search(string[] values);
        Task<Doctor?> Get(int id);
        Task<int> Insert(Doctor entity);
        Task Update(Doctor entity);
        Task Delete(Doctor entity);
    }
}
