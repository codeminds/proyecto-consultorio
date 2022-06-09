using API.Data;
using API.Data.Filters;
using API.Data.Models;

namespace API.Repositories
{
    public class DoctorRepository : Repository<Doctor, int>, IDoctorRepository
    {
        public DoctorRepository(HospitalDB database) : base(database)
        { }

        public override IQueryable<Doctor> Find(int id)
        {
            return this.Query.Where(d => d.Id == id);
        }

        public IQueryable<Doctor> List(DoctorListFilter filter)
        { 
            return this.Query
                        .Where(d => (string.IsNullOrWhiteSpace(filter.DocumentId) || d.DocumentId.Contains(filter.DocumentId))
                                        && (string.IsNullOrWhiteSpace(filter.FirstName) || d.FirstName.Contains(filter.FirstName))
                                        && (string.IsNullOrWhiteSpace(filter.LastName) || d.LastName.Contains(filter.LastName))
                                        && (!filter.FieldId.HasValue || d.FieldId == filter.FieldId));
        }
    }
}