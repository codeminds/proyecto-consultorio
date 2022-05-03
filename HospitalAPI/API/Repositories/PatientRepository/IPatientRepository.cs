using API.Data.Models;

namespace API.Repositories
{
    public interface IPatientRepository
    {
        IQueryable<Patient> Query { get; }
        IQueryable<Patient> Find(int id);
        IQueryable<Patient> Search(IEnumerable<string> values);
        void Insert(Patient entity);
        void Update(Patient entity);
        void Delete(Patient entity);
    }
}
