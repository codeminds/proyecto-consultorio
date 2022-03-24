using API.DataTransferObjects;

namespace API.Services
{
    public interface IAppointmentService
    {
        Task<List<GetAppointmentDTO>> List(FilterAppointmentDTO filter);
        Task<GetAppointmentDTO> Get(int id);
        Task<GetAppointmentDTO> Insert(CreateUpdateAppointmentDTO data);
        Task<GetAppointmentDTO?> Update(int id, CreateUpdateAppointmentDTO data);
        Task<GetAppointmentDTO?> Delete(int id);
    }
}
