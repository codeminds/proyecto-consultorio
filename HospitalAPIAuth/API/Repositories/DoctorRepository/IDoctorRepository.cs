using API.Data.Models;

namespace API.Repositories
{
    public interface IDoctorRepository
    {
        IQueryable<Doctor> Query { get; }
        IQueryable<Doctor> Find(int id);
        IQueryable<Doctor> Search(IEnumerable<string> values);
        void Insert(Doctor entity);
        void Update(Doctor entity);
        void Delete(Doctor entity);
    }
}
