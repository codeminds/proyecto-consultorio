using API.Data.Models;

namespace API.Services
{
    public interface IFieldService
    {
        IQueryable<Field> ListFields();
    }
}