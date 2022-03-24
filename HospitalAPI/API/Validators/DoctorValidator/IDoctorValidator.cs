using API.DataTransferObjects;

namespace API.Validators
{
    public interface IDoctorValidator
    {
        bool ValidateInsert(CreateUpdateDoctorDTO data, List<string> messages);
        bool ValidateUpdate(int id, CreateUpdateDoctorDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }
}
