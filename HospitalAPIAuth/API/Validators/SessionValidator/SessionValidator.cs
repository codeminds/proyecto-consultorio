using API.DataTransferObjects;

namespace API.Validators
{
    public class SessionValidator : ISessionValidator
    {
        public bool ValidateLogin(LoginSessionDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //Email
            if (string.IsNullOrWhiteSpace(data.Email))
            {
                innerMessages.Add("Email es requerido");
            }

            //Password
            if (string.IsNullOrWhiteSpace(data.Password))
            {
                innerMessages.Add("Nombre es requerido");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
