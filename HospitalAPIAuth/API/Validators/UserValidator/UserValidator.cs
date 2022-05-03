using API.DataTransferObjects;
using API.Repositories;
using API.Utils;
using System.Text.RegularExpressions;

namespace API.Validators
{
    public class UserValidator : IUserValidator
    {
        private readonly IUserRepository _userRepository;

        public UserValidator(IUserRepository userRepository)
        {
            this._userRepository = userRepository;
        }

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

        public bool ValidateUpdate(int id, UpdateUserDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //Email
            if (string.IsNullOrWhiteSpace(data.Email))
            {
                innerMessages.Add("Email es requerido");
            }
            else if (!Regex.IsMatch(data.Email, RegularExpressions.Email))
            {
                innerMessages.Add("Email no tiene un formato válido");
            }
            else if (this._userRepository.Query.Any(u => u.Email == data.Email && u.Id != id))
            {
                innerMessages.Add("Email ya pertenece a otro usuario");
            }
            else if (data.Email.Length > 100)
            {
                innerMessages.Add("Email no puede contener más de 100 caracteres");
            }

            //FirstName
            if (string.IsNullOrWhiteSpace(data.FirstName))
            {
                innerMessages.Add("Nombre es requerido");
            }
            else if (data.FirstName.Length > 50)
            {
                innerMessages.Add("Nombre no puede contener más de 50 caracteres");
            }

            //LastName
            if (string.IsNullOrWhiteSpace(data.LastName))
            {
                innerMessages.Add("Apellido es requerido");
            }
            else if (data.LastName.Length > 50)
            {
                innerMessages.Add("Apellido no puede contener más de 50 caracteres");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdatePassword(UpdateUserPasswordDTO data, List<string> messages)
        {
            List<string> innerMessages = new List<string>();

            //Password
            if (string.IsNullOrWhiteSpace(data.Password))
            {
                innerMessages.Add("Contraseña es requerida");
            }
            else if (!Regex.IsMatch(data.Password, RegularExpressions.Password))
            {
                innerMessages.Add("Contraseña debe contener 8 caracteres con al menos 1 letra minúscula, 1 letra mayúscula, 1 número y un caractér especial");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
