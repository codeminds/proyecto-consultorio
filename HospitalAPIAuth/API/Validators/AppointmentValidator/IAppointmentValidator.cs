using API.DataTransferObjects;

namespace API.Validators
{
    public interface IAppointmentValidator
    {
        bool ValidateInsert(CreateUpdateAppointmentDTO data, List<string> messages);
        bool ValidateUpdate(int id, CreateUpdateAppointmentDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }
}
