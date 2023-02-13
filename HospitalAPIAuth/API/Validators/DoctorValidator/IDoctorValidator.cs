using API.DataTransferObjects;

namespace API.Validators
{
   public interface IDoctorValidator
   {
      bool ValidateInsert(InsertUpdateDoctorDTO data, List<string> messages);
      bool ValidateUpdate(int id, InsertUpdateDoctorDTO data, List<string> messages);
      bool ValidateDelete(int id, List<string> messages);
   }
}
