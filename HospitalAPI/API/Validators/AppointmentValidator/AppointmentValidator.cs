using API.Data;
using API.DataTransferObjects;

namespace API.Validators
{
    public class AppointmentValidator : IAppointmentValidator
    {
        private readonly HospitalDB _database;

        public AppointmentValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsert(InsertUpdateAppointmentDTO data, List<string> messages)
        {
            List<string> innerMessages = new();

            //Date
            if (!data.Date.HasValue)
            {
                innerMessages.Add("Fecha es requerida");
            }
            else if (data.Date <= DateTime.Now)
            {
                innerMessages.Add("Cita no puede tener una fecha anterior a la fecha actual");
            }
            //IMPORTANTE: Sólo para proyecto Angular
            else
            {
                bool doctorHasConflict = this._database
                                            .Appointment
                                            .Any(a => a.DoctorId == data.DoctorId
                                                        && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                                                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1))));
                if (doctorHasConflict)
                {
                    innerMessages.Add("El doctor ya tiene una cita agendada durante la fecha y hora seleccionada");
                }

                bool patientHasConflict = this._database
                                            .Appointment
                                            .Any(a => a.PatientId == data.PatientId
                                                        && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                                                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1))));

                if (patientHasConflict)
                {
                    innerMessages.Add("El paciente ya tiene una cita agendada durante la fecha y hora seleccionada");
                }
            }

            //Doctor
            if (!data.DoctorId.HasValue)
            {
                innerMessages.Add("Doctor es requerido");
            }
            else if (!this._database.Appointment.Any(d => d.Id == data.DoctorId))
            {
                innerMessages.Add("Debe seleccionar un doctor que esté registrado en el sistema");
            }

            //Patient
            if (!data.PatientId.HasValue)
            {
                innerMessages.Add("Paciente es requerido");
            }
            else if (!this._database.Patient.Any(d => d.Id == data.PatientId))
            {
                innerMessages.Add("Debe seleccionar un paciente que esté registrado en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdate(int id, InsertUpdateAppointmentDTO data, List<string> messages)
        {
            List<string> innerMessages = new();

            //Date
            if (!data.Date.HasValue)
            {
                innerMessages.Add("Fecha es requerida");
            }
            else if (data.Date <= DateTime.Now)
            {
                innerMessages.Add("Cita no puede tener una fecha anterior a la fecha actual");
            }
            //IMPORTANTE: Sólo para proyecto Angular
            else
            {
                bool doctorHasConflict = this._database
                                            .Appointment
                                            .Any(a =>a.Id != id 
                                                        && a.DoctorId == data.DoctorId
                                                        && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                                                        || (data.Date > a.Date && data.Date < a.Date.AddHours(1))));

                if (doctorHasConflict)
                {
                    innerMessages.Add("El doctor ya tiene una cita agendada durante la fecha y hora seleccionada");
                }

                bool patientHasConflict = this._database
                                            .Appointment
                                            .Any(a => a.Id != id &&
                                                    a.PatientId == data.PatientId
                                                    && ((data.Date.Value.AddHours(1) > a.Date && data.Date.Value.AddHours(1) < a.Date.AddHours(1))
                                                        || (data.Date > a.Date && data.Date < a.Date.AddHours(1))));

                if (patientHasConflict)
                {
                    innerMessages.Add("El paciente ya tiene una cita agendada durante la fecha y hora seleccionada");
                }
            }

            //Doctor
            if (!data.DoctorId.HasValue)
            {
                innerMessages.Add("Doctor es requerido");
            }
            else if (!this._database.Doctor.Any(d => d.Id == data.DoctorId))
            {
                innerMessages.Add("Debe seleccionar un doctor que esté registrado en el sistema");
            }

            //Patient
            if (!data.PatientId.HasValue)
            {
                innerMessages.Add("Paciente es requerido");
            }
            else if (!this._database.Patient.Any(d => d.Id == data.PatientId))
            {
                innerMessages.Add("Debe seleccionar un paciente que esté registrado en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
