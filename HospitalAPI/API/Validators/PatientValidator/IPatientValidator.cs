using API.DataTransferObjects;

namespace API.Validators
{
    public interface IPatientValidator
    {
        bool ValidateInsert(InsertUpdatePatientDTO data, List<string> messages);
        bool ValidateUpdate(int id, InsertUpdatePatientDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }   
}
