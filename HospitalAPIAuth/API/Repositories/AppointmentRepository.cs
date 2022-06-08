global using IAppointmentRepository = API.Repositories.IRepository<API.Data.Models.Appointment, int>;

using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class AppointmentRepository : Repository<Appointment, int>
    {
        public AppointmentRepository(HospitalDB database) : base(database, (a, id) => a.Id == id)
        {}
    }
}
