using API.DataTransferObjects;

namespace API.Validators
{
    public interface IAppointmentValidator
    {
        //IMPORTANTE: Id sólo para proyecto Angular 
        bool ValidateInsertUpdate(int? id, InsertUpdateAppointmentDTO data, List<string> messages);
    }
}
