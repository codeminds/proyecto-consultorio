using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Patient
{
    public int Id { get; set; }

    public string DocumentId { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Tel { get; set; } = null!;

    public string Email { get; set; } = null!;

    public virtual ICollection<Appointment> Appointment { get; } = new List<Appointment>();
}
