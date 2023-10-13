using API.DataTransferObjects;

namespace API.Validators
{
    public interface ISessionValidator
    {
        bool ValidateLogin(LoginSessionDTO data, List<string> messages);
    }
}