using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly HospitalDB _database;
        private readonly IMapper _mapper;
        private readonly IDoctorService _doctorService;
        private readonly IPatientService _patientService;

        public AppointmentService(HospitalDB database, IMapper mapper, IDoctorService doctorService, IPatientService patientService)
        {
            this._database = database;
            this._mapper = mapper;
            this._doctorService = doctorService;
            this._patientService = patientService;
        }

        public async Task<List<GetAppointmentDTO>> List(FilterAppointmentDTO filter)
        {
            List<int> doctorIds = (await this._doctorService.List(this._mapper.Map<FilterAppointmentDTO, FilterDoctorDTO>(filter))).Select(d => d.Id).ToList();
            List<int> patientIds = (await this._patientService.List(this._mapper.Map<FilterAppointmentDTO, FilterPatientDTO>(filter))).Select(d => d.Id).ToList();

            return await this._database.Appointment
                                        .Include(a => a.Patient)
                                        .Include(a => a.Doctor)
                                        .Include(a => a.Doctor.Field)
                                        .Where(a => (!filter.DateFrom.HasValue || a.Date >= filter.DateFrom)
                                                    && (!filter.DateTo.HasValue || a.Date <= filter.DateTo)
                                                    && doctorIds.Contains(a.DoctorId)
                                                    && patientIds.Contains(a.PatientId))
                                        .Select(d => this._mapper.Map<Appointment, GetAppointmentDTO>(d))
                                        .ToListAsync();
        }

        public async Task<GetAppointmentDTO?> Get(int id)
        {
            Appointment? entity = await this._database.Appointment
                                    .Include(a => a.Patient)
                                    .Include(a => a.Doctor)
                                    .Include(a => a.Doctor.Field)
                                    .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null)
            {
                return null;
            }

            return this._mapper.Map<Appointment, GetAppointmentDTO>(entity);
        }

        public async Task<GetAppointmentDTO> Insert(CreateUpdateAppointmentDTO data)
        {
            Appointment entity = this._mapper.Map<CreateUpdateAppointmentDTO, Appointment>(data);


            this._database.Appointment.Add(entity);
            await this._database.SaveChangesAsync();

            this._database.Appointment.Add(entity);
            await this._database.SaveChangesAsync();

            entity = await this._database.Appointment
                                    .Include(a => a.Patient)
                                    .Include(a => a.Doctor)
                                    .Include(a => a.Doctor.Field)
                                    .FirstOrDefaultAsync(d => d.Id == entity.Id);
            return this._mapper.Map<Appointment, GetAppointmentDTO>(entity);
        }

        public async Task<GetAppointmentDTO?> Update(int id, CreateUpdateAppointmentDTO data)
        {
            Appointment? entity = await this._database.Appointment
                                                    .Include(a => a.Patient)
                                                    .Include(a => a.Doctor)
                                                    .Include(a => a.Doctor.Field)
                                                    .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null)
            {
                return null;
            }

            this._mapper.Map(data, entity);
            this._database.Appointment.Update(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Appointment?, GetAppointmentDTO?>(entity);
        }

        public async Task<GetAppointmentDTO?> Delete(int id)
        {
            Appointment? entity = await this._database.Appointment
                                                    .Include(a => a.Patient)
                                                    .Include(a => a.Doctor)
                                                    .Include(a => a.Doctor.Field)
                                                    .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null)
            {
                return null;
            }

            this._database.Appointment.Remove(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Appointment?, GetAppointmentDTO?>(entity);
        }
    }
}
