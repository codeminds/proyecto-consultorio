using API.DataTransferObjects;

namespace API.Services
{
    public interface IFieldService
    {
        Task<List<GetFieldDTO>> List();
    }
}
