using API.DataTransferObjects;
using System.Collections.Generic;

namespace API.Validators
{
    public interface IAppointmentValidator
    {
        bool ValidateInsert(CreateUpdateAppointmentDTO data, List<string> messages);
        bool ValidateUpdate(int id, CreateUpdateAppointmentDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }
}
