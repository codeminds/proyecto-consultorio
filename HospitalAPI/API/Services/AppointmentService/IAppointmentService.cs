using API.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IAppointmentService
    {
        Task<GetAppointmentDTO> Get(int id);
        Task<List<GetAppointmentDTO>> List(FilterAppointmentDTO filter);
        Task<GetAppointmentDTO> Insert(CreateUpdateAppointmentDTO data);
        Task<GetAppointmentDTO> Update(int id, CreateUpdateAppointmentDTO data);
        Task<GetAppointmentDTO> Delete(int id);
    }
}
