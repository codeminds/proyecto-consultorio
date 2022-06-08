global using IPatientRepository = API.Repositories.IRepository<API.Data.Models.Patient, int>;

using API.Data;
using API.Data.Models;

namespace API.Repositories
{
    public class PatientRepository : Repository<Patient, int>
    {
        public PatientRepository(HospitalDB database) : base(database, (p, id) => p.Id == id)
        {}
    }
}
