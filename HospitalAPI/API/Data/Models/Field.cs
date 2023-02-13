using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Field
{
   public int Id { get; set; }

   public string Name { get; set; } = null!;

   public virtual ICollection<Doctor> Doctor { get; } = new List<Doctor>();
}
