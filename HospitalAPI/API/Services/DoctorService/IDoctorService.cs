using API.DataTransferObjects;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IDoctorService
    {
        Task<GetDoctorDTO> Get(int id);
        Task<List<GetDoctorDTO>> List(FilterDoctorDTO filter);
        Task<GetDoctorDTO> Insert(CreateUpdateDoctorDTO data);
        Task<GetDoctorDTO> Update(int id, CreateUpdateDoctorDTO data);
        Task<GetDoctorDTO> Delete(int id);
    }
}
