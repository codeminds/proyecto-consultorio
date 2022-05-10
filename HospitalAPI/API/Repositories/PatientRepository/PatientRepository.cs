﻿using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace API.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        public IQueryable<Patient> Query
        {
            get { return this._database.Patient; }
        }

        private readonly HospitalDB _database;

        public PatientRepository(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Patient> Find(int id)
        {
            return this._database.Patient.Where(p => p.Id == id);
        }

        public IQueryable<Patient> Search(IEnumerable<string> values)
        {
            StringBuilder queryString = new StringBuilder();
            queryString.Append("SELECT * FROM Patient WHERE ");

            int items = values.Count();
            for (int i = 0; i < items; i++)
            {
                string value = values.ElementAt(i);
                queryString.Append($"DocumentId LIKE '%{value}%' OR FirstName LIKE '%{value}%' OR LastName LIKE '%{value}%' ");

                if (i < items - 1)
                {
                    queryString.Append("OR ");
                }
            }

            return this._database.Patient.FromSqlRaw(queryString.ToString());
        }

        public void Insert(Patient entity)
        {
            this._database.Patient.Add(entity);
        }

        public void Update(Patient entity)
        {
            this._database.Patient.Update(entity);
        }

        public void Delete(Patient entity)
        {
            this._database.Patient.Remove(entity);
        }
    }
}