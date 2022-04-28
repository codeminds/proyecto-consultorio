using API.Data.Models;

namespace API.Services
{
    public interface IRoleService
    {
        Task<List<Role>> List();
        Task<Role?> Get(int id);
    }
}
