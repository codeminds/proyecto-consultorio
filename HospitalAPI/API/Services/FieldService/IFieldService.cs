using API.DataTransferObjects;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IFieldService
    {
        Task<List<GetFieldDTO>> List();
    }
}
