using API.Data.Models;
using System.Linq.Expressions;

namespace API.Repositories
{
    public interface IPatientRepository
    {
        IQueryable<Patient> Find(int id);
        IQueryable<Patient> Query(Expression<Func<Patient, bool>>? filter = null);
        IQueryable<Patient> Search(IEnumerable<string> values);
        void Insert(Patient entity);
        void Update(Patient entity);
        void Delete(Patient entity);
    }
}
