using API.Data.Models;

namespace API.Services
{
   public interface IRoleService
   {
      IQueryable<Role> ListRoles();
   }
}