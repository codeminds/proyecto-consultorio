using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Role
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<User> User { get; } = new List<User>();
}
