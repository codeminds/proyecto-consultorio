using API.Data;
using API.DataTransferObjects;

namespace API.Validators
{
    public class PatientValidator : IPatientValidator
    {
        private readonly HospitalDB _database;

        public PatientValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsertUpdate(int? id, InsertUpdatePatientDTO data, List<string> messages)
        {
            List<string> innerMessages = new();

            //DocumentId
            if (string.IsNullOrWhiteSpace(data.DocumentId))
            {
                innerMessages.Add("Cédula es requerida");
            }
            else if (data.DocumentId.Trim().Length != 9)
            {
                innerMessages.Add("Cédula debe contener 9 digitos");
            }
            else if (data.DocumentId.StartsWith("0"))
            {
                innerMessages.Add("Cédula no puede comenzar con 0");
            }
            else if (!int.TryParse(data.DocumentId, out int num) || num < 0)
            {
                innerMessages.Add("Cédula sólo puede contener números");
            }
            else if (this._database.Patient.Any(p => p.DocumentId == data.DocumentId && p.Id != id))
            {
                innerMessages.Add("Cédula ya está registrada en el sistema");
            }

            //FirstName
            if (string.IsNullOrWhiteSpace(data.FirstName))
            {
                innerMessages.Add("Nombre es requerido");
            }
            else if (data.FirstName.Length > 50)
            {
                innerMessages.Add("Nombre no puede contener más de 50 caracteres");
            }

            //LastName
            if (string.IsNullOrWhiteSpace(data.LastName))
            {
                innerMessages.Add("Apellido es requerido");
            }
            else if (data.LastName.Length > 50)
            {
                innerMessages.Add("Apellido no puede contener más de 50 caracteres");
            }

            //Tel
            if (string.IsNullOrWhiteSpace(data.Tel))
            {
                innerMessages.Add("Tel es requerido");
            }
            else if (data.Tel.Trim().Length != 8)
            {
                innerMessages.Add("Tel debe contener 8 digitos");
            }
            else if (data.Tel.StartsWith("0"))
            {
                innerMessages.Add("Tel no puede comenzar con 0");
            }
            else if (!int.TryParse(data.Tel, out int num) || num < 0)
            {
                innerMessages.Add("Tel sólo puede contener números");
            }

            //Email
            if (string.IsNullOrWhiteSpace(data.Email))
            {
                innerMessages.Add("Correo es requerido");
            }
            else if (data.Email.Length > 100)
            {
                innerMessages.Add("Correo no puede contener más de 100 caracteres");
            }
            else if (this._database.Patient.Any(p => p.Email == data.Email && p.Id != id))
            {
                innerMessages.Add("Correo ya está registrado en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, List<string> messages)
        {
            List<string> innerMessages = new();

            if (this._database.Appointment.Any(a => a.PatientId == id))
            {
                innerMessages.Add("No se puede borrar el record. El paciente tiene citas asociadas en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
