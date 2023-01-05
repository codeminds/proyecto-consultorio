using API.Data;
using API.DataTransferObjects;
using API.Utils;
using System.Text.RegularExpressions;

namespace API.Validators
{
    public class UserValidator : IUserValidator
    {
        private readonly HospitalDB _database;

        public UserValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsert(InsertUserDTO data, List<string> messages)
        { 
            List<string> innerMessages = new();

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

            //Email
            if (string.IsNullOrWhiteSpace(data.Email))
            {
                innerMessages.Add("Email es requerido");
            }
            else if (data.Email.Length > 100)
            {
                innerMessages.Add("Email no puede contener más de 100 caracteres");
            }
            else if (!Regex.IsMatch(data.Email, RegularExpressions.Email))
            {
                innerMessages.Add("Email no tiene un formato válido");
            }
            else if (this._database.User.Any(u => u.Email == data.Email))
            {
                innerMessages.Add("Email ya pertenece a otro usuario");
            }

            //Password
            if (string.IsNullOrWhiteSpace(data.Password))
            {
                innerMessages.Add("Contraseña es requerida");
            }
            else if (!Regex.IsMatch(data.Password, RegularExpressions.Password))
            {
                innerMessages.Add("Contraseña debe contener 8 caracteres con al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 caracter especial");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdateInfo(int id, UpdateUserInfoDTO data, List<string> messages, bool validateAdmin = false)
        {
            List<string> innerMessages = new();

            if(validateAdmin && this._database.User.Any(u => u.Id == id && u.RoleId == (int)UserRole.Administrator))
            { 
                innerMessages.Add("No puede modificar la información de otros administradores");
                return false;
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

        public bool ValidateUpdateEmail(int id, UpdateUserEmailDTO data, List<string> messages, bool validateAdmin = false)
        {
            List<string> innerMessages = new();

            if(validateAdmin && this._database.User.Any(u => u.Id == id && u.RoleId == (int)UserRole.Administrator))
            { 
                innerMessages.Add("No puede modificar la información de otros administradores");
                return false;
            }

            //Email
            if (string.IsNullOrWhiteSpace(data.Email))
            {
                innerMessages.Add("Email es requerido");
            }
            else if (data.Email.Length > 100)
            {
                innerMessages.Add("Email no puede contener más de 100 caracteres");
            }
            else if (!Regex.IsMatch(data.Email, RegularExpressions.Email))
            {
                innerMessages.Add("Email no tiene un formato válido");
            }
            else if (this._database.User.Any(u => u.Email == data.Email && u.Id != id))
            {
                innerMessages.Add("Email ya pertenece a otro usuario");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdatePassword(UpdateUserPasswordDTO data, List<string> messages)
        {
            List<string> innerMessages = new();

            //Password
            if (string.IsNullOrWhiteSpace(data.Password))
            {
                innerMessages.Add("Contraseña es requerida");
            }
            else if (!Regex.IsMatch(data.Password, RegularExpressions.Password))
            {
                innerMessages.Add("Contraseña debe contener 8 caracteres con al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 caracter especial");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, List<string> messages, bool validateAdmin)
        {
            List<string> innerMessages = new();

            if (validateAdmin && this._database.User.Any(u => u.Id == id && u.RoleId == (int)UserRole.Administrator))
            {
                innerMessages.Add("No puede eliminar a otros administradores");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}