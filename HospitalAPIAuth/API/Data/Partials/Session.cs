using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data.Models
{
    public partial class Session
    {
        [NotMapped]
        public string? AccessTokenString { get; set; }

        [NotMapped]
        public string? RefreshTokenString { get; set; }
    }
}
