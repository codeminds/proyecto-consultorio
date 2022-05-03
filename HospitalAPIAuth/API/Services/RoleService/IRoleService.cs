using API.Data.Filters;
using API.Data.Models;

namespace API.Services
{
    public interface IRoleService
    {
        Task<List<Role>> ListRoles();
    }
}
