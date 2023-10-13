using API.Data.Models;

namespace API.Services
{
    public interface IStatusService
    {
        IQueryable<Status> ListStatusses();
    }
}
