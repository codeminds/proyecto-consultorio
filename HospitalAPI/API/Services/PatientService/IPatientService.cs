using API.DataTransferObjects;

namespace API.Services
{
    public interface IPatientService
    {
        Task<List<GetPatientDTO>> List(FilterPatientDTO filter);
        Task<List<GetPatientDTO>> Search(string[] values);
        Task<GetPatientDTO?> Get(int id);
        Task<GetPatientDTO> Insert(CreateUpdatePatientDTO data);
        Task<GetPatientDTO?> Update(int id, CreateUpdatePatientDTO data);
        Task<GetPatientDTO?> Delete(int id);
    }
}
