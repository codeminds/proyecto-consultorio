using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data.Models
{
   public partial class Session
   {
      /* Este atributo informa a Entity Framework que para efectos de SQL
      se debe ignorar esta propiedad */
      [NotMapped]
      public string? AccessTokenString { get; set; }

      /* Este atributo informa a Entity Framework que para efectos de SQL
      se debe ignorar esta propiedad */
      [NotMapped]
      public string? RefreshTokenString { get; set; }
   }
}