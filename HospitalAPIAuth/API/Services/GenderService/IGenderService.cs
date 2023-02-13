using API.Data.Models;

namespace API.Services
{
   public interface IGenderService
   {
      IQueryable<Gender> ListGenders();
   }
}
