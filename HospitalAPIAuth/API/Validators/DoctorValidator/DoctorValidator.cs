using API.Data;
using API.DataTransferObjects;
using API.Services;

namespace API.Validators
{
    public class DoctorValidator : IDoctorValidator
    {
        private readonly HospitalDB _database;

        public DoctorValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsertUpdate(int? id, InsertUpdateDoctorDTO data, List<string> messages)
        {
            List<string> innerMessages = new();

            //Code
            if (string.IsNullOrWhiteSpace(data.Code))
            {
                innerMessages.Add("Código es requerido");
            }
            else if (data.Code.Trim().Length != 10)
            {
                innerMessages.Add("Código debe contener 10 digitos");
            }
            else if (data.Code.StartsWith("0"))
            {
                innerMessages.Add("Código no puede comenzar con 0");
            }
            else if (!long.TryParse(data.Code, out long num) || num < 0)
            {
                innerMessages.Add("Código sólo puede contener números");
            }
            else if (this._database.Doctor.Any(d => d.Code == data.Code && d.Id != id))
            {
                innerMessages.Add("Código ya está registrado en el sistema");
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

            //Field
            if (!data.FieldId.HasValue)
            {
                innerMessages.Add("Especialidad es requerida");
            }
            else if (!this._database.Field.Any(f => f.Id == data.FieldId))
            {
                innerMessages.Add("Debe seleccionar una especialidad que exista en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, List<string> messages)
        {
            List<string> innerMessages = new();

            if (this._database.Appointment.Any(a => a.DoctorId == id))
            {
                innerMessages.Add("No se puede borrar el record. El doctor tiene citas asociadas en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}