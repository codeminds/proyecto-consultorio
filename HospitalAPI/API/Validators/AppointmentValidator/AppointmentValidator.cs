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
                innerMessages.Add("Appointment cannot have a previous date to the current date");
            }

            if (this._database.Appointments.Any(a => 
                        a.DoctorId == data.DoctorId 
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
            {
                innerMessages.Add("Doctor already has an appointment in that date and time");
            }

            if (this._database.Appointments.Any(a =>
                        a.PatientId == data.PatientId
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date > a.Date && data.Date < a.Date.AddHours(1)))))
            {
                innerMessages.Add("Patient already has an appointment in that date and time");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdate(int id, CreateUpdateAppointmentDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            if (data.Date <= DateTime.Now)
            {
                innerMessages.Add("Appointment cannot have a previous date to the current date");
            }

            if (this._database.Appointments.Any(a =>
                        a.Id != id
                        && a.DoctorId == data.DoctorId
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date >= a.Date && data.Date <= a.Date.AddHours(1)))))
            {
                innerMessages.Add("Doctor already has an appointment in that date and time");
            }

            if (this._database.Appointments.Any(a =>
                        a.Id != id
                        && a.PatientId == data.PatientId
                        && ((data.Date.AddHours(1) > a.Date && data.Date.AddHours(1) < a.Date.AddHours(1))
                            || (data.Date >= a.Date && data.Date <= a.Date.AddHours(1)))))
            {
                innerMessages.Add("Patient already has an appointment in that date and time");
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
