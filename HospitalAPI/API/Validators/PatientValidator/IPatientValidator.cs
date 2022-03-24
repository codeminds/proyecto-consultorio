using API.DataTransferObjects;

namespace API.Validators
{
    public interface IPatientValidator
    {
        bool ValidateInsert(CreateUpdatePatientDTO data, List<string> messages);
        bool ValidateUpdate(int id, CreateUpdatePatientDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }   
}
