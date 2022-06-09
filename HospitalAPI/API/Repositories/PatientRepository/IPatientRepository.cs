using API.Data.Filters;
using API.Data.Models;

namespace API.Repositories
{
    public interface IPatientRepository: IRepository<Patient, int>
    {
        IQueryable<Patient> List(PatientListFilter filter);
    }
}