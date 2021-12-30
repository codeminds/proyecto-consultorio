using API.Data;
using API.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Validators
{
    public class DoctorValidator : IDoctorValidator
    {
        private readonly HospitalDB _database;

        public DoctorValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsert(CreateUpdateDoctorDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //DocumentId
            if (string.IsNullOrWhiteSpace(data.DocumentId))
            {
                innerMessages.Add("DocumentId is required");
            }
            else if (data.DocumentId.Trim().Length != 9)
            {
                innerMessages.Add("DocumentId must have 9 digits");
            }
            else if (!int.TryParse(data.DocumentId, out int num) || num < 0)
            {
                innerMessages.Add("DocumentId can only contain numbers");
            }
            else if (this._database.Doctors.Any(d => d.DocumentId == data.DocumentId))
            {
                innerMessages.Add("DocumentId number already exists in the system");
            }

            //First Name
            if (string.IsNullOrWhiteSpace(data.FirstName))
            {
                innerMessages.Add("First Name is required");
            }
            else if (data.FirstName.Length > 50)
            {
                innerMessages.Add("First Name can only contain 50 characters");
            }

            //Last Name
            if (string.IsNullOrWhiteSpace(data.LastName))
            {
                innerMessages.Add("Last Name is required");
            }
            else if (data.LastName.Length > 50)
            {
                innerMessages.Add("Last Name can only contain 50 characters");
            }

            //Field
            if (!this._database.Fields.Any(f => f.Id == data.FieldId))
            {
                innerMessages.Add("Field is not valid");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdate(int id, CreateUpdateDoctorDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //DocumentId
            if (string.IsNullOrWhiteSpace(data.DocumentId))
            {
                innerMessages.Add("DocumentId is required");
            }
            else if (data.DocumentId.Trim().Length != 9)
            {
                innerMessages.Add("DocumentId must have 9 digits");
            }
            else if (!int.TryParse(data.DocumentId, out int num) || num < 0)
            {
                innerMessages.Add("DocumentId can only contain numbers");
            }
            else if (this._database.Doctors.Any(d => d.DocumentId == data.DocumentId && d.Id != id))
            {
                innerMessages.Add("DocumentId number already exists in the system");
            }

            //First Name
            if (string.IsNullOrWhiteSpace(data.FirstName))
            {
                innerMessages.Add("First Name is required");
            }
            else if (data.FirstName.Length > 50)
            {
                innerMessages.Add("First Name can only contain 50 characters");
            }

            //Last Name
            if (string.IsNullOrWhiteSpace(data.LastName))
            {
                innerMessages.Add("Last Name is required");
            }
            else if (data.LastName.Length > 50)
            {
                innerMessages.Add("Last Name can only contain 50 characters");
            }

            //Field
            if (!this._database.Fields.Any(f => f.Id == data.FieldId))
            {
                innerMessages.Add("Field is not valid");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            if (this._database.Appointments.Any(a => a.DoctorId == id))
            {
                innerMessages.Add("Can't delete this record. Doctor has appointments associated to it");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
