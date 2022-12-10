﻿using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IPatientService
    {
        IQueryable<Patient> ListPatients(PatientListFilter? filter);
        Task<Patient?> FindPatient(int id);
        Task InsertPatient(Patient entity);
        Task UpdatePatient(Patient entity);
        Task DeletePatient(Patient entity);
    }
}
