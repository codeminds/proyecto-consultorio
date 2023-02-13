using API.DataTransferObjects;

namespace API.Validators
{
   public class SessionValidator : ISessionValidator
   {
      public bool ValidateLogin(LoginSessionDTO data, List<string> messages)
      {
         List<string> innerMessages = new();

         //Email
         if (string.IsNullOrWhiteSpace(data.Email))
         {
            innerMessages.Add("Usuario es requerido");
         }

         //Password
         if (string.IsNullOrWhiteSpace(data.Password))
         {
            innerMessages.Add("Contraseña es requerida");
         }

         messages.AddRange(innerMessages);

         return !innerMessages.Any();
      }
   }
}