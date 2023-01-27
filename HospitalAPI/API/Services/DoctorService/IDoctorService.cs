using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IDoctorService
    {
        IQueryable<Doctor> ListDoctors(DoctorListFilter? filter);
        //IMPORTANTE: Sólo para proyecto Angular
        IQueryable<Doctor> SearchDoctors(string[] values);
        Task<Doctor?> FindDoctor(int id);
        Task InsertDoctor(Doctor entity);
        Task UpdateDoctor(Doctor entity);
        Task DeleteDoctor(Doctor entity);
    }
}
