global using IDoctorRepository = API.Repositories.IRepository<API.Data.Models.Doctor, int>;

using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class DoctorRepository : Repository<Doctor, int>
    {
        public DoctorRepository(HospitalDB database) : base(database, (d, id) => d.Id == id)
        { }
    }
}
