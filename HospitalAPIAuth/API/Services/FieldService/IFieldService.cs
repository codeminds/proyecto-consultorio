using API.Data.Models;

namespace API.Services
{
    public interface IFieldService
    {
        Task<List<Field>> ListFields();
    }
}
