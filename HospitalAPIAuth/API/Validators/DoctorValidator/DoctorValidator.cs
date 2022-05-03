using API.DataTransferObjects;
using API.Repositories;

namespace API.Validators
{
    public class DoctorValidator : IDoctorValidator
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IFieldRepository _fieldRepository;
        private readonly IAppointmentRepository _appointmentRepository;

        public DoctorValidator(IDoctorRepository doctorRepository, IFieldRepository fieldRepository, IAppointmentRepository appointmentRepository)
        {
            this._doctorRepository = doctorRepository;
            this._fieldRepository = fieldRepository;
            this._appointmentRepository = appointmentRepository;
        }


        public bool ValidateInsert(CreateUpdateDoctorDTO data, List<string> messages)
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
            else if (this._doctorRepository.Query.Any(d => d.DocumentId == data.DocumentId))
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

            //Field
            if (!data.FieldId.HasValue)
            {
                innerMessages.Add("Especialidad es requerida");
            }
            else if (!this._fieldRepository.Query.Any(f => f.Id == data.FieldId))
            {
                innerMessages.Add("Debe seleccionar una especialidad que exista en el sistema");
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
            else if (this._doctorRepository.Query.Any(d => d.DocumentId == data.DocumentId && d.Id != id))
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

            //Field
            if (!data.FieldId.HasValue)
            {
                innerMessages.Add("Especialidad es requerida");
            }
            else if (!this._fieldRepository.Query.Any(f => f.Id == data.FieldId))
            {
                innerMessages.Add("Debe seleccionar una especialidad que exista en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            if (this._appointmentRepository.Query.Any(a => a.DoctorId == id))
            {
                innerMessages.Add("No se puede borrar el record. El doctor tiene citas asociadas en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
