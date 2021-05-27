using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace API.Services
{
    public class PatientService : IPatientService
    {
        private readonly HospitalDB _database;
        private readonly IMapper _mapper;

        public PatientService(HospitalDB database, IMapper mapper)
        {
            this._database = database;
            this._mapper = mapper;
        }

        public async Task<GetPatientDTO> Get(int id)
        {
            Patient entity = await this._database.Patients
                                                    .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null) return null;

            return this._mapper.Map<Patient, GetPatientDTO>(entity);
        }

        public async Task<List<GetPatientDTO>> List(FilterPatientDTO filter)
        {
            return await this._database.Patients
                                           .Where(p => (string.IsNullOrWhiteSpace(filter.Identification) || p.Identification.Contains(filter.Identification))
                                                       && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                                                       && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                                                       && (!filter.BirthDateFrom.HasValue || p.BirthDate >= filter.BirthDateFrom)
                                                       && (!filter.BirthDateTo.HasValue || p.BirthDate <= filter.BirthDateTo))
                                           .Select(p => this._mapper.Map<Patient, GetPatientDTO>(p))
                                           .ToListAsync();
        }

        public async Task<GetPatientDTO> Insert(CreateUpdatePatientDTO data)
        {
            Patient entity = this._mapper.Map<CreateUpdatePatientDTO, Patient>(data);

            this._database.Patients.Add(entity);
            await this._database.SaveChangesAsync();

            return await this.Get(entity.Id);
        }

        public async Task<GetPatientDTO> Update(int id, CreateUpdatePatientDTO data)
        {
            Patient entity = await this._database.Patients
                                                     .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null) return null;

            this._mapper.Map(data, entity);
            this._database.Patients.Update(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Patient, GetPatientDTO>(entity);
        }

        public async Task<GetPatientDTO> Delete(int id)
        {
            Patient entity = await this._database.Patients
                                                    .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null) return null;

            this._database.Patients.Remove(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Patient, GetPatientDTO>(entity);
        }
    }
}
