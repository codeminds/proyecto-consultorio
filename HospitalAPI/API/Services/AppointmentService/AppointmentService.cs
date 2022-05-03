using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly HospitalDB _database;
        private readonly IMapper _mapper;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPatientService _patientService;
        private readonly IDoctorService _doctorService;

        public AppointmentService(HospitalDB database, IMapper mapper, IAppointmentRepository appointmentRepository, IPatientService patientService, IDoctorService doctorService)
        {
            this._database = database;
            this._mapper = mapper;
            this._appointmentRepository = appointmentRepository;
            this._patientService = patientService;
            this._doctorService = doctorService;
        }

        public async Task<List<Appointment>> ListAppointments(AppointmentListFilter? filter = null, PatientListFilter? patientFilter = null, DoctorListFilter? doctorFilter = null)
        {
            filter = filter ?? new AppointmentListFilter();
            patientFilter = patientFilter ?? new PatientListFilter();
            doctorFilter = doctorFilter ?? new DoctorListFilter();

            List<int> doctorIds = (await this._doctorService.ListDoctors(doctorFilter)).Select(d => d.Id).ToList();
            List<int> patientIds = (await this._patientService.ListPatients(patientFilter)).Select(d => d.Id).ToList();

            return await this._appointmentRepository
                                    .Query(a => (!filter.DateFrom.HasValue || a.Date >= filter.DateFrom)
                                                    && (!filter.DateTo.HasValue || a.Date <= filter.DateTo)
                                                    && doctorIds.Contains(a.DoctorId)
                                                    && patientIds.Contains(a.PatientId))
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
            await this._database.SaveChangesAsync();

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
            await this._database.SaveChangesAsync();
        }

        public async Task DeleteAppointment(Appointment appointment)
        {
            this._appointmentRepository.Delete(appointment);
            await this._database.SaveChangesAsync();
        }
    }
}
