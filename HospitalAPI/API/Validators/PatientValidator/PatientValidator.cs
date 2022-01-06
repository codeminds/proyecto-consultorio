﻿using API.Data;
using API.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.Validators
{
    public class PatientValidator : IPatientValidator
    {
        private readonly HospitalDB _database;

        public PatientValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsert(CreateUpdatePatientDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //DocumentId
            if (string.IsNullOrWhiteSpace(data.DocumentId))
            {
                innerMessages.Add("Cédula es requerida");
            }
            else if (data.DocumentId.Trim().Length != 9)
            {
                innerMessages.Add("Cédula debe contener 9 digitos");
            }
            else if (!int.TryParse(data.DocumentId, out int num) || num < 0)
            {
                innerMessages.Add("Cédula sólo puede contener números");
            }
            else if (this._database.Patients.Any(d => d.DocumentId == data.DocumentId))
            {
                innerMessages.Add("Cédula ya está registrada en el sistema");
            }

            //First Name
            if (string.IsNullOrWhiteSpace(data.FirstName))
            {
                innerMessages.Add("Nombre es requerido");
            }
            else if (data.FirstName.Length > 50)
            {
                innerMessages.Add("Nombre no puede contener más de 50 caracteres");
            }

            //Last Name
            if (string.IsNullOrWhiteSpace(data.LastName))
            {
                innerMessages.Add("Apellido es requerido");
            }
            else if (data.LastName.Length > 50)
            {
                innerMessages.Add("Apellido no puede contener más de 50 caracteres");
            }

            //BirthDate
            if (data.BirthDate > DateTime.Now)
            {
                innerMessages.Add("Fecha de nacimiento no puede ser mayor a la fecha actual");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdate(int id, CreateUpdatePatientDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //DocumentId
            if (string.IsNullOrWhiteSpace(data.DocumentId))
            {
                innerMessages.Add("Cédula es requerida");
            }
            else if (data.DocumentId.Trim().Length != 9)
            {
                innerMessages.Add("Cédula debe contener 9 digitos");
            }
            else if (!int.TryParse(data.DocumentId, out int num) || num < 0)
            {
                innerMessages.Add("Cédula sólo puede contener números");
            }
            else if (this._database.Patients.Any(d => d.DocumentId == data.DocumentId && d.Id != id))
            {
                innerMessages.Add("Cédula ya está registrada en el sistema");
            }

            //First Name
            if (string.IsNullOrWhiteSpace(data.FirstName))
            {
                innerMessages.Add("Nombre es requerido");
            }
            else if (data.FirstName.Length > 50)
            {
                innerMessages.Add("Nombre no puede contener más de 50 caracteres");
            }

            //Last Name
            if (string.IsNullOrWhiteSpace(data.LastName))
            {
                innerMessages.Add("Apellido es requerido");
            }
            else if (data.LastName.Length > 50)
            {
                innerMessages.Add("Apellido no puede contener más de 50 caracteres");
            }

            //BirthDate
            if (data.BirthDate > DateTime.Now)
            {
                innerMessages.Add("Fecha de nacimiento no puede ser mayor a la fecha actual");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            if (this._database.Appointments.Any(a => a.PatientId == id))
            {
                innerMessages.Add("No se puede borrar el record. El paciente tiene citas asociadas en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
