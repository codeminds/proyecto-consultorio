using API.DataTransferObjects;

namespace API.Validators
{
    public interface IUserValidator
    {
        bool ValidateInsert(InsertUserDTO data, List<string> messages);
        bool ValidateUpdateInfo(int id, UpdateUserInfoDTO data, List<string> messages, bool validateAdmin = false);
        bool ValidateUpdateEmail(int id, UpdateUserEmailDTO data, List<string> messages, bool validateAdmin = false);
        bool ValidateUpdatePassword(UpdateUserPasswordDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages, bool validateAdmin);
    }   
}