using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class User
{
   public int Id { get; set; }

   public string Email { get; set; } = null!;

   public byte[] Password { get; set; } = null!;

   public byte[] PasswordSalt { get; set; } = null!;

   public string FirstName { get; set; } = null!;

   public string LastName { get; set; } = null!;

   public int RoleId { get; set; }

   public bool IsSuperAdmin { get; set; }

   public virtual Role Role { get; set; } = null!;

   public virtual ICollection<Session> Session { get; } = new List<Session>();
}
