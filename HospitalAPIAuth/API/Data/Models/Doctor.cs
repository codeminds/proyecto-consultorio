using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Doctor
{
    public int Id { get; set; }

    public string DocumentId { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public int FieldId { get; set; }

    public virtual ICollection<Appointment> Appointment { get; } = new List<Appointment>();

    public virtual Field Field { get; set; } = null!;
}
