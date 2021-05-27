using System.Collections.Generic;
using System.Threading.Tasks;
using API.DataTransferObjects;

namespace API.Services
{
    public interface IPatientService
    {
        Task<GetPatientDTO> Get(int id);
        Task<List<GetPatientDTO>> List(FilterPatientDTO filter);
        Task<GetPatientDTO> Insert(CreateUpdatePatientDTO data);
        Task<GetPatientDTO> Update(int id, CreateUpdatePatientDTO data);
        Task<GetPatientDTO> Delete(int id);
    }
}
