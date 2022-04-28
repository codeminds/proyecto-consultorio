using System;
using System.Collections.Generic;

namespace API.Data.Models
{
    public partial class Session
    {
        public long Id { get; set; }
        public Guid SessionId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public DateTime Expiration { get; set; }
        public byte[] RefreshToken { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}
