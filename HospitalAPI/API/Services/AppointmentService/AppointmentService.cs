using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class AppointmentService : Service, IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDoctorRepository _doctorRepository;

        public AppointmentService(HospitalDB database, IAppointmentRepository appointmentRepository, IPatientRepository patientRepository, IDoctorRepository doctorRepository) : base(database)
        {
            this._appointmentRepository = appointmentRepository;
            this._patientRepository = patientRepository;
            this._doctorRepository = doctorRepository;
        }

        public async Task<List<Appointment>> ListAppointments(AppointmentListFilter? filter = null, PatientListFilter? patientFilter = null, DoctorListFilter? doctorFilter = null)
        {
            filter ??= new AppointmentListFilter();
            patientFilter ??= new PatientListFilter();
            doctorFilter ??= new DoctorListFilter();

            IQueryable<Doctor> doctors = this._doctorRepository.List(doctorFilter);
            IQueryable<Patient> patients = this._patientRepository.List(patientFilter);

            return await this._appointmentRepository.Query
                                    .Where(a => (!filter.DateFrom.HasValue || a.Date >= filter.DateFrom)
                                                    && (!filter.DateTo.HasValue || a.Date <= filter.DateTo)
                                                    && doctors.Contains(a.Doctor)
                                                    && patients.Contains(a.Patient))
                                    .Include(a => a.Patient)
                                    .Include(a => a.Doctor)
                                    .Include(a => a.Doctor.Field)
                                    .ToListAsync();
        }

        public async Task<Appointment?> FindAppointment(int id)
        {
            return await this._appointmentRepository
                                .Find(id)
                                .Include(a => a.Patient)
                                .Include(a => a.Doctor)
                                .Include(a => a.Doctor.Field)
                                .FirstOrDefaultAsync();
        }

        public async Task<Appointment> CreateAppointment(Appointment appointment)
        {
            this._appointmentRepository.Insert(appointment);
            await this.SaveRepositoriesAsync();

            return (await this._appointmentRepository
                                        .Find(appointment.Id)
                                        .Include(a => a.Patient)
                                        .Include(a => a.Doctor)
                                        .Include(a => a.Doctor.Field)
                                        .FirstOrDefaultAsync())!;
        }

        public async Task UpdateAppointment(Appointment appointment)
        {
            this._appointmentRepository.Update(appointment);
            await this.SaveRepositoriesAsync();
        }

        public async Task DeleteAppointment(Appointment appointment)
        {
            this._appointmentRepository.Delete(appointment);
            await this.SaveRepositoriesAsync();
        }
    }
}
