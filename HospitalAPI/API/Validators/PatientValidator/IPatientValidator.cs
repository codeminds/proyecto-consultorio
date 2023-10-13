using API.DataTransferObjects;

namespace API.Validators
{
    public interface IPatientValidator
    {
        bool ValidateInsertUpdate(int? id, InsertUpdatePatientDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }
}