using API.Data.Filters;
using API.Data.Models;

namespace API.Repositories
{
    public interface IDoctorRepository: IRepository<Doctor, int>
    {
        IQueryable<Doctor> List(DoctorListFilter filter);
    }
}