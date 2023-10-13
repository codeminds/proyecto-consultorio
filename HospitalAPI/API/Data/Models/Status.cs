using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Status
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Appointment> Appointment { get; } = new List<Appointment>();
}
