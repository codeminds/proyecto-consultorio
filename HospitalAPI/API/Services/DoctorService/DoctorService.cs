﻿using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text.RegularExpressions;

namespace API.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly HospitalDB _database;
        private readonly IDoctorRepository _doctorRepository;

        public DoctorService(HospitalDB database, IDoctorRepository doctorRepository)
        {
            this._database = database;
            this._doctorRepository = doctorRepository;
        }

        public async Task<List<Doctor>> ListDoctors(DoctorListFilter? filter = null)
        {
            filter = filter ?? new DoctorListFilter();

            return await this._doctorRepository.Query
                                    .Where(d => (string.IsNullOrWhiteSpace(filter.DocumentId) || d.DocumentId.Contains(filter.DocumentId))
                                                    && (string.IsNullOrWhiteSpace(filter.FirstName) || d.FirstName.Contains(filter.FirstName))
                                                    && (string.IsNullOrWhiteSpace(filter.LastName) || d.LastName.Contains(filter.LastName))
                                                    && (!filter.FieldId.HasValue || d.FieldId == filter.FieldId))
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
            await this._database.SaveChangesAsync();

            return (await this._doctorRepository
                                        .Find(doctor.Id)
                                        .Include(d => d.Field)
                                        .FirstOrDefaultAsync())!;
        }

        public async Task UpdateDoctor(Doctor doctor)
        {
            this._doctorRepository.Update(doctor);
            await this._database.SaveChangesAsync();
        }

        public async Task DeleteDoctor(Doctor doctor)
        {
            this._doctorRepository.Delete(doctor);
            await this._database.SaveChangesAsync();
        }
    }
}
