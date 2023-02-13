using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Gender
{
   public int Id { get; set; }

   public string Name { get; set; } = null!;

   public virtual ICollection<Patient> Patient { get; } = new List<Patient>();
}
