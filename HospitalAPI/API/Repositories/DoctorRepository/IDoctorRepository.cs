using API.Data.Models;
using System.Linq.Expressions;

namespace API.Repositories
{
    public interface IDoctorRepository
    {
        IQueryable<Doctor> Find(int id);
        IQueryable<Doctor> Query(Expression<Func<Doctor, bool>>? filter = null);
        IQueryable<Doctor> Search(IEnumerable<string> values);
        void Insert(Doctor entity);
        void Update(Doctor entity);
        void Delete(Doctor entity);
    }
}
