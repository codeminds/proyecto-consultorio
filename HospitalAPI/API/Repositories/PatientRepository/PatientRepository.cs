using API.Data;
using API.Data.Filters;
using API.Data.Models;

namespace API.Repositories
{
    public class PatientRepository : Repository<Patient, int>, IPatientRepository
    {
        public PatientRepository(HospitalDB database) : base(database)
        { }

        public override IQueryable<Patient> Find(int id)
        {
            return this.Query.Where(p => p.Id == id);
        }

        public IQueryable<Patient> List(PatientListFilter filter)
        { 
            return this.Query
                        .Where(p => (string.IsNullOrWhiteSpace(filter.DocumentId) || p.DocumentId.Contains(filter.DocumentId))
                                        && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                                        && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                                        && (!filter.BirthDateFrom.HasValue || p.BirthDate >= filter.BirthDateFrom)
                                        && (!filter.BirthDateTo.HasValue || p.BirthDate <= filter.BirthDateTo)
                                        && (!filter.Gender.HasValue || p.Gender == filter.Gender));
        }
    }
}