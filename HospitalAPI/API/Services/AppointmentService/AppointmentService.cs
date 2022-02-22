using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task<GetAppointmentDTO> Get(int id)
        {
            Appointment entity = await this._database.Appointments
                                                    .Include(a => a.Doctor)
                                                    .Include(a => a.Doctor.Field)
                                                    .Include(a => a.Patient)
                                                    .FirstOrDefaultAsync(a => a.Id == id);

            if (entity == null) return null;

            return this._mapper.Map<Appointment, GetAppointmentDTO>(entity);
        }

        public async Task<List<GetAppointmentDTO>> List(FilterAppointmentDTO filter)
        {
            FilterDoctorDTO doctorFilter = new FilterDoctorDTO();
            doctorFilter.DocumentId = filter.DoctorDocumentId;
            doctorFilter.FirstName = filter.DoctorFirstName;
            doctorFilter.LastName = filter.DoctorLastName;
            doctorFilter.FieldId = filter.DoctorFieldId;

            List<int> doctorIds = (await this._doctorService.List(doctorFilter)).Select(d => d.Id).ToList();

            FilterPatientDTO patientFilter = new FilterPatientDTO();
            patientFilter.DocumentId = filter.PatientDocumentId;
            patientFilter.FirstName = filter.PatientFirstName;
            patientFilter.LastName = filter.PatientLastName;
            patientFilter.BirthDateFrom = filter.PatientBirthDateFrom;
            patientFilter.BirthDateTo = filter.PatientBirthDateTo;
            patientFilter.Gender = filter.Gender;

            List<int> patientIds = (await this._patientService.List(patientFilter)).Select(p => p.Id).ToList();

            return await this._database.Appointments
                                           .Include(a => a.Doctor)
                                           .Include(a => a.Doctor.Field)
                                           .Include(a => a.Patient)
                                           .Where(a => (!filter.DateFrom.HasValue || a.Date >= filter.DateFrom)
                                                        && (!filter.DateTo.HasValue || a.Date <= filter.DateTo)
                                                        && doctorIds.Contains(a.DoctorId)
                                                        && patientIds.Contains(a.PatientId))
                                           .Select(a => this._mapper.Map<Appointment, GetAppointmentDTO>(a))
                                           .ToListAsync();
        }

        public async Task<GetAppointmentDTO> Insert(CreateUpdateAppointmentDTO data)
        {
            Appointment entity = this._mapper.Map<CreateUpdateAppointmentDTO, Appointment>(data);

            this._database.Appointments.Add(entity);
            await this._database.SaveChangesAsync();

            return await this.Get(entity.Id);
        }

        public async Task<GetAppointmentDTO> Update(int id, CreateUpdateAppointmentDTO data)
        {
            Appointment entity = await this._database.Appointments
                                                     .Include(a => a.Doctor)
                                                     .Include(a => a.Doctor.Field)
                                                     .Include(a => a.Patient)
                                                     .FirstOrDefaultAsync(a => a.Id == id);

            if (entity == null) return null;

            this._mapper.Map(data, entity);
            this._database.Appointments.Update(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Appointment, GetAppointmentDTO>(entity);
        }

        public async Task<GetAppointmentDTO> Delete(int id)
        {
            Appointment entity = await this._database.Appointments
                                                    .Include(a => a.Doctor)
                                                    .Include(a => a.Doctor.Field)
                                                    .Include(a => a.Patient)
                                                    .FirstOrDefaultAsync(a => a.Id == id);

            if (entity == null) return null;

            this._database.Appointments.Remove(entity);
            await this._database.SaveChangesAsync();

            return this._mapper.Map<Appointment, GetAppointmentDTO>(entity);
        }
    }
}
