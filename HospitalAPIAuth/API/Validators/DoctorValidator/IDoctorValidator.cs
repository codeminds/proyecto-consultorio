using API.DataTransferObjects;

namespace API.Validators
{
    public interface IDoctorValidator
    {
        bool ValidateInsertUpdate(int? id, InsertUpdateDoctorDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }
}