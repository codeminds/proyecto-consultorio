using API.DataTransferObjects;

namespace API.Validators
{
    public interface IAppointmentValidator
    {
        bool ValidateInsert(InsertUpdateAppointmentDTO data, List<string> messages);
        bool ValidateUpdate(int id, InsertUpdateAppointmentDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }
}
