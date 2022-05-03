using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IDoctorService
    {
        Task<List<Doctor>> ListDoctors(DoctorListFilter? filter);
        Task<List<Doctor>> SearchDoctors(string[] values);
        Task<Doctor?> FindDoctor(int id);
        Task<Doctor> CreateDoctor(Doctor patient);
        Task UpdateDoctor(Doctor Doctor);
        Task DeleteDoctor(Doctor entity);
    }
}
