using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IAppointmentService
    {
        Task<List<Appointment>> ListAppointments(AppointmentListFilter? filter = null, PatientListFilter? patientFilter = null, DoctorListFilter? doctorFilter = null);
        Task<Appointment?> FindAppointment(int id);
        Task<Appointment> CreateAppointment(Appointment patient);
        Task UpdateAppointment(Appointment Appointment);
        Task DeleteAppointment(Appointment entity);
    }
}
