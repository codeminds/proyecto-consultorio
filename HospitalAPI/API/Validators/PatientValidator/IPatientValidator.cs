using API.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Validators
{
    public interface IPatientValidator
    {
        bool ValidateInsert(CreateUpdatePatientDTO data, List<string> messages);
        bool ValidateUpdate(int id, CreateUpdatePatientDTO data, List<string> messages);
        bool ValidateDelete(int id, List<string> messages);
    }
}
