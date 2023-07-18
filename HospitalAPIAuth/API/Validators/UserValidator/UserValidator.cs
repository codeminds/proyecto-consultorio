using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using API.Utils;
using System.Text.RegularExpressions;

namespace API.Validators
{
    public class UserValidator : IUserValidator
    {
        public readonly HospitalDB _database;

        public UserValidator(HospitalDB database)
        {
            this._database = database;
        }

        public bool ValidateInsert(InsertUpdateUserDTO data, List<string> messages)
        {
            List<string> innerMessages = new();

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
                innerMessages.Add("Email ya está registrado en el sistema");
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

            //Password
            if (string.IsNullOrWhiteSpace(data.NewPassword) || !Regex.IsMatch(data.NewPassword, RegularExpressions.Password))
            {
                innerMessages.Add("Contraseña debe contener 8 caracteres con al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 caracter especial");
            }

            //Role
            if (!data.RoleId.HasValue)
            {
                innerMessages.Add("Rol es requerido");
            }
            else if (!this._database.Role.Any(r => r.Id == data.RoleId))
            {
                innerMessages.Add("Debe seleccionar un rol que exista en el sistema");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdate(int id, InsertUpdateUserDTO data, bool isSuperAdmin, List<string> messages)
        {
            List<string> innerMessages = new();

            if(!isSuperAdmin && this._database.User.Any(u => u.Id == id && u.RoleId == (int)UserRole.Administrator))
            { 
                innerMessages.Add("No puede modificar la información de otros administradores");
            }
            else
            { 
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
                    innerMessages.Add("Email ya está registrado en el sistema");
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

                //Password
                if (!string.IsNullOrWhiteSpace(data.NewPassword) && !Regex.IsMatch(data.NewPassword, RegularExpressions.Password))
                {
                    innerMessages.Add("Contraseña debe contener 8 caracteres con al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 caracter especial");
                }

                //Role
                if (!data.RoleId.HasValue)
                {
                    innerMessages.Add("Rol de Usuario es requerido");
                }
                else if (!this._database.Role.Any(r => r.Id == data.RoleId))
                {
                    innerMessages.Add("Debe asignar un rol que exista en el sistema");
                }
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateUpdateSelf(int id, UpdateSelfUserDTO data, List<string> messages)
        {
            List<string> innerMessages = new();

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
            else if(this._database.User.Any(u => u.Email == data.Email && u.Id != id))
            { 
                innerMessages.Add("Email ya pertenece a otro usuario");
            }

            //FirstName
            if (string.IsNullOrWhiteSpace(data.FirstName))
            { 
                innerMessages.Add("Nombre es requerido");
            }
            else if (data.FirstName.Length > 50)
            { 
                innerMessages.Add("Nombre no puede contener más de 100 caracteres");
            }

            //LastName
            if (string.IsNullOrWhiteSpace(data.LastName))
            { 
                innerMessages.Add("Apellido es requerido");
            }
            else if (data.LastName.Length > 50)
            { 
                innerMessages.Add("Apellido no puede contener más de 100 caracteres");
            }

            //Password
            if(!string.IsNullOrWhiteSpace(data.NewPassword) && !Regex.IsMatch(data.NewPassword, RegularExpressions.Password))
            { 
                innerMessages.Add("Contraseña debe contener 8 caracteres con al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 caracter especial");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }

        public bool ValidateDelete(int id, bool isSuperAdmin, List<string> messages)
        {
            List<string> innerMessages = new();

            if(!isSuperAdmin && this._database.User.Any(u => u.Id == id && u.RoleId == (int)UserRole.Administrator))
            { 
                innerMessages.Add("No puede eliminar a otros administradores");
            }

            messages.AddRange(innerMessages);

            return !innerMessages.Any();
        }
    }
}
