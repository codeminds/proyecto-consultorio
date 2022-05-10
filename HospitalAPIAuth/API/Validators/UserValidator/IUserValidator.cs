using API.DataTransferObjects;

namespace API.Validators
{
    public interface IUserValidator
    {
        bool ValidateUpdateInfo(UpdateUserDTO data, List<string> messages);
        bool ValidateUpdateEmail(int id, UpdateUserEmailDTO data, List<string> messages);
        bool ValidateUpdatePassword(UpdateUserPasswordDTO data, List<string> messages);
    }   
}
