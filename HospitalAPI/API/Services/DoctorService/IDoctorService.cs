using API.DataTransferObjects;

namespace API.Services
{
    public interface IDoctorService
    {
        Task<List<GetDoctorDTO>> List(FilterDoctorDTO filter);
        Task<List<GetDoctorDTO>> Search(string[] values);
        Task<GetDoctorDTO?> Get(int id);
        Task<GetDoctorDTO> Insert(CreateUpdateDoctorDTO data);
        Task<GetDoctorDTO?> Update(int id, CreateUpdateDoctorDTO data);
        Task<GetDoctorDTO?> Delete(int id);
    }
}
