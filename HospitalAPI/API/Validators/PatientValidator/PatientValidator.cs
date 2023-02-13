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


      public bool ValidateInsert(InsertUpdatePatientDTO data, List<string> messages)
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
         else if (!int.TryParse(data.DocumentId, out int num) || num < 0)
         {
            innerMessages.Add("Cédula sólo puede contener números");
         }
         else if (this._database.Patient.Any(p => p.DocumentId == data.DocumentId))
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

         //Gender
         if (!data.GenderId.HasValue)
         {
            innerMessages.Add("Género es requerido");
         }
         else if (!this._database.Gender.Any(g => g.Id == data.GenderId))
         {
            innerMessages.Add("Debe seleccionar un género que exista en el sistema");
         }

         //BirthDate
         if (!data.BirthDate.HasValue)
         {
            innerMessages.Add("Fecha de nacimiento es requerida");
         }
         else if (data.BirthDate.Value >= DateTime.Now)
         {
            innerMessages.Add("Fecha de nacimiento no puede ser mayor a fecha actual");
         }

         messages.AddRange(innerMessages);

         return !innerMessages.Any();
      }

      public bool ValidateUpdate(int id, InsertUpdatePatientDTO data, List<string> messages)
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

         //Gender
         if (!data.GenderId.HasValue)
         {
            innerMessages.Add("Género es requerido");
         }
         else if (!this._database.Gender.Any(g => g.Id == data.GenderId))
         {
            innerMessages.Add("Debe seleccionar un género que exista en el sistema");
         }

         //BirthDate
         if (!data.BirthDate.HasValue)
         {
            innerMessages.Add("Fecha de nacimiento es requerida");
         }
         else if (data.BirthDate.Value >= DateTime.Now)
         {
            innerMessages.Add("Fecha de nacimiento no puede ser mayor a fecha actual");
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
