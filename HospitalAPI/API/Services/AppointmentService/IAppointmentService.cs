using API.Data.Models;
using API.DataTransferObjects;

namespace API.Services
{
    public interface IAppointmentService
    {
        Task<List<Appointment>> List(FilterAppointmentDTO filter);
        Task<Appointment?> Get(int id);
        Task<int> Insert(Appointment entity);
        Task Update(Appointment entity);
        Task Delete(Appointment entity);
    }
}
