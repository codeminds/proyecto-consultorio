using API.Data.Models;

namespace API.Repositories
{
    public interface IAppointmentRepository
    {
        IQueryable<Appointment> Query { get; }
        IQueryable<Appointment> Find(int id);
        IQueryable<Appointment> Search(IEnumerable<string> values);
        void Insert(Appointment entity);
        void Update(Appointment entity);
        void Delete(Appointment entity);
    }
}