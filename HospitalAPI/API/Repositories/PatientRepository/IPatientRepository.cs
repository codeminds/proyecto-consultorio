using API.Data.Models;
using System.Linq.Expressions;

namespace API.Repositories
{
    public interface IAppointmentRepository
    {
        IQueryable<Appointment> Find(int id);
        IQueryable<Appointment> Query(Expression<Func<Appointment, bool>>? filter = null);
        IQueryable<Appointment> Search(IEnumerable<string> values);
        void Insert(Appointment entity);
        void Update(Appointment entity);
        void Delete(Appointment entity);
    }
}
