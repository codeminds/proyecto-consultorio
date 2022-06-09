using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Services
{
    public class DoctorService : Service, IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorService(HospitalDB database, IDoctorRepository doctorRepository) : base(database)
        {
            this._doctorRepository = doctorRepository;
        }

        public async Task<List<Doctor>> ListDoctors(DoctorListFilter? filter = null)
        {
            filter ??= new DoctorListFilter();
                                    
            return await this._doctorRepository
                                    .List(filter)
                                    .Include(d => d.Field)
                                    .ToListAsync();
        }

        public async Task<List<Doctor>> SearchDoctors(string[] values)
        {
            return await this._doctorRepository
                                .Search(values,
                                        (value) => (doctor) => doctor.DocumentId.Contains(value)
                                            || doctor.FirstName.Contains(value)
                                            || doctor.LastName.Contains(value)
                                            || doctor.Field.Name.Contains(value),
                                        includes: new List<Expression<Func<Doctor, object>>>
                                        { 
                                            doctor => doctor.Field  
                                        },
                                        orderBys: new List<Expression<Func<Doctor, object>>>
                                        {
                                            doctor => doctor.DocumentId,
                                            doctor => doctor.FirstName,
                                            doctor => doctor.LastName
                                        }
                                )
                                .ToListAsync();
        }

        public async Task<Doctor?> FindDoctor(int id)
        {
            return await this._doctorRepository
                                .Find(id)
                                .Include(d => d.Field)
                                .FirstOrDefaultAsync();
        }

        public async Task<Doctor> CreateDoctor(Doctor doctor)
        {
            this._doctorRepository.Insert(doctor);
            await this.SaveRepositoriesAsync();

            return (await this._doctorRepository
                                        .Find(doctor.Id)
                                        .Include(d => d.Field)
                                        .FirstOrDefaultAsync())!;
        }

        public async Task UpdateDoctor(Doctor doctor)
        {
            this._doctorRepository.Update(doctor);
            await this.SaveRepositoriesAsync();
        }

        public async Task DeleteDoctor(Doctor doctor)
        {
            this._doctorRepository.Delete(doctor);
            await this.SaveRepositoriesAsync();
        }
    }
}
