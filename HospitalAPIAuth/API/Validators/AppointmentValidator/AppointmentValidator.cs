using API.DataTransferObjects;
using API.Repositories;

namespace API.Validators
{
    public class AppointmentValidator : IAppointmentValidator
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDoctorRepository _doctorRepository;

        public AppointmentValidator(IAppointmentRepository appointmentRepository, IPatientRepository patientRepository, IDoctorRepository doctorRepository)
        {
            this._appointmentRepository = appointmentRepository;
            this._patientRepository = patientRepository;
            this._doctorRepository = doctorRepository;
        }


        public bool ValidateInsert(CreateUpdateAppointmentDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //Date
            if (!data.Date.HasValue)
            {
                innerMessages.Add("Fecha es requerida");
            }
            else if (data.Date <= DateTime.Now)
            {
                innerMessages.Add("Cita no puede tener una fecha anterior a la fecha actual");
            }
            else
            {
                if (this._appointmentRepository.Query.Any(a =>
                            a.DoctorId == data.DoctorId
                            && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
                {
                    innerMessages.Add("El doctor ya tiene una cita agendada durante la fecha y hora seleccionada");
                }

                if (this._appointmentRepository.Query.Any(a =>
                            a.PatientId == data.PatientId
                            && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                                || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
                {
                    innerMessages.Add("El paciente ya tiene una cita agendada durante la fecha y hora seleccionada");
                }
            }

            //Doctor
            if (!data.DoctorId.HasValue)
            {
                innerMessages.Add("Doctor es requerido");
            }
            else if (!this._appointmentRepository.Query.Any(d => d.Id == data.DoctorId))
            {
                innerMessages.Add("Debe seleccionar un doctor que esté registrado en el sistema");
            }

            //Patient
            if (!data.PatientId.HasValue)
            {
                innerMessages.Add("Paciente es requerido");
            }
            else if (!this._patientRepository.Query.Any(d => d.Id == data.PatientId))
            {
                innerMessages.Add("Debe seleccionar un paciente que esté registrado en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdate(int id, CreateUpdateAppointmentDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //Date
            if (!data.Date.HasValue)
            {
                innerMessages.Add("Fecha es requerida");
            }
            else
            {
                if (this._appointmentRepository.Query.Any(a =>
                            a.Id != id &&
                            a.DoctorId == data.DoctorId
                            && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
                {
                    innerMessages.Add("El doctor ya tiene una cita agendada durante la fecha y hora seleccionada");
                }

                if (this._appointmentRepository.Query.Any(a =>
                            a.Id != id &&
                            a.PatientId == data.PatientId
                            && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                                || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
                {
                    innerMessages.Add("El paciente ya tiene una cita agendada durante la fecha y hora seleccionada");
                }
            }

            //Doctor
            if (!data.DoctorId.HasValue)
            {
                innerMessages.Add("Doctor es requerido");
            }
            else if (!this._doctorRepository.Query.Any(d => d.Id == data.DoctorId))
            {
                innerMessages.Add("Debe seleccionar un doctor que esté registrado en el sistema");
            }

            //Patient
            if (!data.PatientId.HasValue)
            {
                innerMessages.Add("Paciente es requerido");
            }
            else if (!this._patientRepository.Query.Any(d => d.Id == data.PatientId))
            {
                innerMessages.Add("Debe seleccionar un paciente que esté registrado en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, List<string> messages)
        {
            return true;
        }
    }
}
