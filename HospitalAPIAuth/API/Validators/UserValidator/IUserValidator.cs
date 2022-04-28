using API.DataTransferObjects;

namespace API.Validators
{
    public interface IUserValidator
    {
        bool ValidateLogin(LoginUserDTO data, List<string> messages);
        bool ValidateUpdate(int id, UpdateUserDTO data, List<string> messages);
        bool ValidateUpdatePassword(UpdateUserPasswordDTO data, List<string> messages);
    }   
}
