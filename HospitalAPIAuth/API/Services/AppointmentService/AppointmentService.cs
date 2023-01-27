using API.Data;
using API.Data.Filters;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly HospitalDB _database;
        private readonly IPatientService _patientService;
        private readonly IDoctorService _doctorService;

        public AppointmentService(HospitalDB database, IPatientService patientService, IDoctorService doctorService)
        {
            this._database = database;
            this._patientService = patientService;
            this._doctorService = doctorService;
        }

        public IQueryable<Appointment> ListAppointments(AppointmentListFilter? filter = null)
        {
            filter ??= new AppointmentListFilter();

            IQueryable<Doctor> doctors = this._doctorService.ListDoctors(filter.Doctor);
            IQueryable<Patient> patients = this._patientService.ListPatients(filter.Patient);

            return this._database
                    .Appointment
                    .Include(a => a.Doctor)
                    .Include(a => a.Doctor.Field)
                    .Include(a => a.Patient)
                    .Include(a => a.Patient.Gender)
                    .Where(a => (!filter.DateFrom.HasValue || a.Date >= filter.DateFrom)
                                    && (!filter.DateTo.HasValue || a.Date <= filter.DateTo)
                                    && doctors.Contains(a.Doctor)
                                    && patients.Contains(a.Patient));
        }

        public async Task<Appointment?> FindAppointment(int id)
        {
            return await this._database
                            .Appointment
                            .Include(a => a.Doctor)
                            .Include(a => a.Doctor.Field)
                            .Include(a => a.Patient)
                            .Include(a => a.Patient.Gender)
                            .Where(d => d.Id == id)
                            .FirstOrDefaultAsync();
        }

        public async Task InsertAppointment(Appointment entity)
        {
            this._database.Appointment.Add(entity);
            await this._database.SaveChangesAsync();
            await this._database.Entry(entity).Reference(a => a.Doctor).Query().Include(d => d.Field).LoadAsync();
            await this._database.Entry(entity).Reference(a => a.Patient).Query().Include(p => p.Gender).LoadAsync();
        }

        public async Task UpdateAppointment(Appointment entity)
        {
            this._database.Appointment.Update(entity);
            await this._database.SaveChangesAsync();
            await this._database.Entry(entity).Reference(a => a.Doctor).Query().Include(d => d.Field).LoadAsync();
            await this._database.Entry(entity).Reference(a => a.Patient).Query().Include(p => p.Gender).LoadAsync();
        }

        public async Task DeleteAppointment(Appointment entity)
        {
            this._database.Appointment.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
