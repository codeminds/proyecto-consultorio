﻿using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.ExtensionMethods;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Services
{
    public class PatientService : IPatientService
    {
        private readonly HospitalDB _database;

        public PatientService(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Patient> ListPatients(PatientListFilter? filter = null)
        {
            filter ??= new PatientListFilter();

            return this._database
                    .Patient
                    .Where(p => (string.IsNullOrWhiteSpace(filter.DocumentId) || p.DocumentId.Contains(filter.DocumentId))
                        && (string.IsNullOrWhiteSpace(filter.FirstName) || p.FirstName.Contains(filter.FirstName))
                        && (string.IsNullOrWhiteSpace(filter.LastName) || p.LastName.Contains(filter.LastName))
                        && (string.IsNullOrWhiteSpace(filter.Tel) || p.LastName.Contains(filter.Tel))
                        && (string.IsNullOrWhiteSpace(filter.Email) || p.LastName.Contains(filter.Email)));
        }

        //IMPORTANTE: Sólo para proyecto Angular
        public IQueryable<Patient> SearchPatients(string[] values)
        {
            return this._database
                    .Patient
                    .Search(values,
                        /* Lambda que recibe un valor de string a evaular y devuelve
                        una expresión de lambda booleana que recibe un doctor */
                        (value) => (patient) => patient.DocumentId.Contains(value)
                            || patient.FirstName.Contains(value)
                            || patient.LastName.Contains(value),
                        //Lista de expresiones lambda para ordenar
                        orderBys: new List<Expression<Func<Patient, object>>>
                        {
                            patient => patient.DocumentId,
                            patient => patient.FirstName,
                            patient => patient.LastName
                        }
                    );
        }

        public async Task<Patient?> FindPatient(int id)
        {
            return await this._database
                            .Patient
                            .Where(p => p.Id == id)
                            .FirstOrDefaultAsync();
        }

        public async Task InsertPatient(Patient entity)
        {
            this._database.Patient.Add(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task UpdatePatient(Patient entity)
        {
            this._database.Patient.Update(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task DeletePatient(Patient entity)
        {
            this._database.Patient.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}