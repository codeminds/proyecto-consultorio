using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Session
{
   public long Id { get; set; }

   public Guid SessionId { get; set; }

   public int UserId { get; set; }

   public DateTime DateIssued { get; set; }

   public DateTime? DateRefreshed { get; set; }

   public DateTime DateExpiry { get; set; }

   public string AddressIssued { get; set; } = null!;

   public string? AddressRefreshed { get; set; }

   public byte[] RefreshToken { get; set; } = null!;

   public virtual User User { get; set; } = null!;
}
