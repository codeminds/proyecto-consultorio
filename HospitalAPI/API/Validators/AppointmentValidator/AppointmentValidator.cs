using API.Data;
using API.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.Validators
{
    public class AppointmentValidator : IAppointmentValidator
    {
        private readonly HospitalDB _database;

        public AppointmentValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsert(CreateUpdateAppointmentDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            if (data.Date <= DateTime.Now)
            {
                innerMessages.Add("Cita no puede tener una fecha anterior a la fecha actual");
            }

            if (this._database.Appointments.Any(a => 
                        a.DoctorId == data.DoctorId 
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
            {
                innerMessages.Add("El doctor ya tiene una cita agendada durante la fecha y hora seleccionada");
            }

            if (this._database.Appointments.Any(a =>
                        a.PatientId == data.PatientId
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
            {
                innerMessages.Add("El paciente ya tiene una cita agendada durante la fecha y hora seleccionada");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdate(int id, CreateUpdateAppointmentDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            if (data.Date <= DateTime.Now)
            {
                innerMessages.Add("Cita no puede tener una fecha anterior a la fecha actual");
            }

            if (this._database.Appointments.Any(a =>
                        a.Id != id
                        && a.DoctorId == data.DoctorId
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date >= a.Date && data.Date <= a.Date.AddHours(1)))))
            {
                innerMessages.Add("El doctor ya tiene una cita agendada durante la fecha y hora seleccionada");
            }

            if (this._database.Appointments.Any(a =>
                        a.Id != id
                        && a.PatientId == data.PatientId
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date >= a.Date && data.Date <= a.Date.AddHours(1)))))
            {
                innerMessages.Add("El paciente ya tiene una cita agendada durante la fecha y hora seleccionada");
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
