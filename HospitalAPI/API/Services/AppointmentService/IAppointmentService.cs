using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IAppointmentService
    {
        IQueryable<Appointment> ListAppointments(AppointmentListFilter? filter = null);
        Task<Appointment?> FindAppointment(int id);
        Task InsertAppointment(Appointment patient);
        Task UpdateAppointment(Appointment Appointment);
        Task DeleteAppointment(Appointment entity);
    }
}