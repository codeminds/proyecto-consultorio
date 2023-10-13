using API.DataTransferObjects;

namespace API.Validators
{
    public interface IUserValidator
    {
        bool ValidateInsertUpdate(int? id, InsertUpdateUserDTO data, bool isSuperAdmin, List<string> messages);
        bool ValidateUpdateSelf(int id, UpdateSelfUserDTO data, List<string> messages);
        bool ValidateDelete(int id, bool isSuperAdmin, List<string> messages);
    }
}