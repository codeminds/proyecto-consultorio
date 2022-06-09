using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class AppointmentRepository : Repository<Appointment, int>, IAppointmentRepository
    {
        public AppointmentRepository(HospitalDB database) : base(database)
        {}

        public override IQueryable<Appointment> Find(int id)
        {
            return this.Query.Where(a => a.Id == id);
        }
    }
}
